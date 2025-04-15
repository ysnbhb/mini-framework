import { DOM } from "./dom.js";

export function TodoApp() {
  const [todos, setTodos] = DOM.useStates([]);
  // const [newTodo, setNewTodo] = DOM.useStates("");

  function addTodo(newTodo) {
    if (!newTodo.trim()) return;
    setTodos([...todos, { text: newTodo, done: false }]);
    DOM.render();
  }

  return DOM.Jsx(
    "div",
    { className: "container" },
    DOM.Jsx("input", {
      type: "text",
      id: "new-todo",
      placeholder: "Add a new task",
    }),

    DOM.Jsx(
      "button",
      {
        onClick: (e) => {
          e.preventDefault();
          addTodo(document.getElementById("new-todo").value);
        },
      },
      "Add Todo"
    ),

    // List todos
    ...todos.map((todo, index) =>
      DOM.Jsx(
        "div",
        { className: "todo-item" },
        DOM.Jsx("input", {
          type: "checkbox",
          checked: todo.done,
          onClick: () => {
            const updatedTodos = [...todos];
            updatedTodos[index].done = !updatedTodos[index].done;
            setTodos(updatedTodos);
          },
        }),
        DOM.Jsx(
          "span",
          {
            className: `todo-text${todo.done ? " done" : ""}`,
          },
          todo.text
        )
      )
    )
  );
}
