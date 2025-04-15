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
    const updatedTodos = todos.filter((todo) => !todo.done);
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

  const remainingTodos = todos.filter((todo) => !todo.done).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  return DOM.Jsx(
    "div",
    { className: "container" },
    DOM.Jsx(
      "div",
      { className: "header" },
      DOM.Jsx("h1", { className: "title" }, "Todos")
    ),

    // 🔧 CENTERED Input and Add Button
    DOM.Jsx(
      "div",
      { className: "todo-input-container" },
      DOM.Jsx("input", {
        type: "text",
        className: "new-todo",
        id: "new-todo",
        placeholder: "What needs to be done?",
      }),
      DOM.Jsx(
        "button",
        {
          className: "add-todo",
          onClick: (e) => {
            e.preventDefault();
            addTodo(document.getElementById("new-todo")?.value);
          },
        },
        "Add Todo"
      )
    ),

    // Todos List
    ...filteredTodos.map((todo, index) =>
      DOM.Jsx(
        "div",
        { className: "todo-item" },
        DOM.Jsx("input", {
          type: "checkbox",
          checked: todo.done,
          onClick: () => toggleTodo(index),
        }),
        DOM.Jsx(
          "span",
          {
            className: `todo-text${todo.done ? " done" : ""}`,
            // onDoubleClick: () => {
            //   const newText = prompt("Edit todo", todo.text);
            //   if (newText !== null) {
            //     handleEditTodo(index, newText);
            //   }
            // },
          },
          todo.text
        ),
        DOM.Jsx(
          "button",
          {
            className: "destroy",
            onClick: () => removeTodo(index),
          },
          "Delete"
        )
      )
    ),

    // Footer
    DOM.Jsx(
      "footer",
      { className: "footer" },
      DOM.Jsx(
        "span",
        { className: "todo-count" },
        `${remainingTodos} items left`
      ),
      DOM.Jsx(
        "div",
        { className: "filters" },
        DOM.Jsx(
          "a",
          {
            className: filter === "all" ? "selected" : "",
            onClick: () => setFilter("all"),
          },
          "All"
        ),
        DOM.Jsx(
          "a",
          {
            className: filter === "active" ? "selected" : "",
            onClick: () => setFilter("active"),
          },
          "Active"
        ),
        DOM.Jsx(
          "a",
          {
            className: filter === "completed" ? "selected" : "",
            onClick: () => setFilter("completed"),
          },
          "Completed"
        )
      ),
      // ✅ Always-render Clear Completed button
      DOM.Jsx(
        "button",
        {
          className: `clear-completed ${
            filter === "completed" ? "visible" : "hidden"
          }`,
          onClick: clearCompleted,
        },
        "Clear Completed"
      )
    )
  );
}


export function TodoApp2() {
  return DOM.Jsx("section", { className: "todoapp", id: "root" },
    DOM.Jsx("header", { className: "header", "data-testid": "header" },
      DOM.Jsx("h1", {}, "todos"),
      DOM.Jsx("div", { className: "input-container" },
        DOM.Jsx("input", {
          className: "new-todo",
          id: "todo-input",
          type: "text",
          "data-testid": "text-input",
          placeholder: "What needs to be done?",
          value: ""
        }),
        DOM.Jsx("label", {
          className: "visually-hidden",
          for: "todo-input"
        }, "New Todo Input")
      )
    ),

    DOM.Jsx("main", { className: "main", "data-testid": "main" },
      DOM.Jsx("div", { className: "toggle-all-container" },
        DOM.Jsx("input", {
          className: "toggle-all",
          type: "checkbox",
          id: "toggle-all",
          "data-testid": "toggle-all"
        }),
        DOM.Jsx("label", {
          className: "toggle-all-label",
          for: "toggle-all"
        }, "Toggle All Input")
      ),

      DOM.Jsx("ul", { className: "todo-list", "data-testid": "todo-list" },
        DOM.Jsx("li", { className: "", "data-testid": "todo-item" },
          DOM.Jsx("div", { className: "view" },
            DOM.Jsx("input", {
              className: "toggle",
              type: "checkbox",
              "data-testid": "todo-item-toggle"
            }),
            DOM.Jsx("label", { "data-testid": "todo-item-label" }, "ggg"),
            DOM.Jsx("button", {
              className: "destroy",
              "data-testid": "todo-item-button"
            })
          )
        )
      )
    ),

    DOM.Jsx("footer", { className: "footer", "data-testid": "footer" },
      DOM.Jsx("span", { className: "todo-count" }, "1 item left!"),
      DOM.Jsx("ul", { className: "filters", "data-testid": "footer-navigation" },
        DOM.Jsx("li", {},
          DOM.Jsx("a", { className: "selected", href: "#/" }, "All")
        ),
        DOM.Jsx("li", {},
          DOM.Jsx("a", { className: "", href: "#/active" }, "Active")
        ),
        DOM.Jsx("li", {},
          DOM.Jsx("a", { className: "", href: "#/completed" }, "Completed")
        )
      ),
      DOM.Jsx("button", { className: "clear-completed", disabled: true }, "Clear completed")
    )
  );
}
