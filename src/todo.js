import { DOM } from "./dom.js";

export function TodoApp() {
  const [todos, setTodos] = DOM.useStates([]);
  const [newTodo, setNewTodo] = DOM.useStates("");

  function addTodo() {
    if (!newTodo.trim()) return;
    setTodos([...todos, { text: newTodo, done: false }]);
    setNewTodo(""); 
    DOM.render();
  }

  return DOM.Jsx("div", { className: "container" },
    DOM.Jsx("input", {
      type: "text",
      value: newTodo, 
      onInput: (e) => {
        const value = e.target.value;
        if (value !== newTodo) {
          setNewTodo(value);
        }
      },
      placeholder: "Add a new task"
    }),

    DOM.Jsx("button", {
      onClick: (e) => {
        e.preventDefault(); 
        addTodo();
      }
    }, "Add Todo"),

    // List todos
    ...todos.map((todo, index) =>
      DOM.Jsx("div", { className: "todo-item" },
        DOM.Jsx("input", {
          type: "checkbox",
          checked: todo.done,
          onClick: () => {
            const updatedTodos = [...todos];
            updatedTodos[index].done = !updatedTodos[index].done;
            setTodos(updatedTodos); 
          }
        }),
        DOM.Jsx("span", {
          className: `todo-text${todo.done ? " done" : ""}` 
        }, todo.text)
      )
    )
  );
}
