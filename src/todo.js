import { DOM } from "./dom.js";

export function TodoApp() {
  const [todos, setTodos] = DOM.useStates([]);
  const [filter, setFilter] = DOM.useStates("all");

  function addTodo(newTodo) {
    if (!newTodo.trim()) return;
    setTodos([...todos, { text: newTodo, done: false }]);
    // setNewTodo("");
  }

  function toggleTodo(index) {
    const updatedTodos = [...todos];
    updatedTodos[index].done = !updatedTodos[index].done;
    setTodos(updatedTodos);
  }

  function removeTodo(index) {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  }

  function clearCompleted() {
    const updatedTodos = todos.filter(todo => !todo.done);
    setTodos(updatedTodos);
  }

  function setActiveFilter(filterType) {
    setFilter(filterType);
  }

  function handleEditTodo(index, newText) {
    const updatedTodos = [...todos];
    updatedTodos[index].text = newText;
    setTodos(updatedTodos);
  }

  const remainingTodos = todos.filter(todo => !todo.done).length;

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  return DOM.Jsx("div", { className: "container" },
    DOM.Jsx("div", { className: "header" },
      DOM.Jsx("h1", { className: "title" }, "Todos")
    ),

    // 🔧 CENTERED Input and Add Button
    DOM.Jsx("div", { className: "todo-input-container" },
      DOM.Jsx("input", {
        type: "text",
        className: "new-todo",
        id : "new-todo",
        placeholder: "What needs to be done?"
      }),
      DOM.Jsx("button", {
        className: "add-todo",
        onClick: (e) => {
          e.preventDefault();
          addTodo(document.getElementById("new-todo")?.value);
        }
      }, "Add Todo")
    ),

    // Todos List
    ...filteredTodos.map((todo, index) =>
      DOM.Jsx("div", { className: "todo-item" },
        DOM.Jsx("input", {
          type: "checkbox",
          checked: todo.done,
          onClick: () => toggleTodo(index)
        }),
        DOM.Jsx("span", {
          className: `todo-text${todo.done ? " done" : ""}`
        }, todo.text),
        DOM.Jsx("button", {
          className: "destroy",
          onClick: () => removeTodo(index)
        }, "Delete")
      )
    ),

    // Footer
    DOM.Jsx("footer", { className: "footer" },
      DOM.Jsx("span", { className: "todo-count" }, `${remainingTodos} items left`),
      DOM.Jsx("div", { className: "filters" },
        DOM.Jsx("a", {
          className: filter === "all" ? "selected" : "",
          onClick: () => setFilter("all")
        }, "All"),
        DOM.Jsx("a", {
          className: filter === "active" ? "selected" : "",
          onClick: () => setFilter("active")
        }, "Active"),
        DOM.Jsx("a", {
          className: filter === "completed" ? "selected" : "",
          onClick: () => setFilter("completed")
        }, "Completed")
      ),
      // ✅ Always-render Clear Completed button
      DOM.Jsx("button", {
        className: `clear-completed ${filter === "completed" ? "visible" : "hidden"}`,
        onClick: clearCompleted
      }, "Clear Completed")
    )
  );
}
