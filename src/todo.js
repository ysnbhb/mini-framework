import { DOM } from "./dom.js";

let todoList = [];

let editId;

function lengthTodo() {
  return todoList.filter((todo) => !todo.done).length;
}

function TodoActive() {
  return todoList.some((todo) => !todo.done);
}

function UpdateAll() {
  let done;
  if (!TodoActive()) {
    done = false;
  } else {
    done = true;
  }
  todoList = todoList.map((todo) => {
    return {
      text: todo.text,
      id: todo.id,
      done,
    };
  });
  DOM.render();
}

const saveEdit = (newText, id) => {
  todoList = todoList.map((todo) => {
    if (todo.id == id) {
      return {
        text: newText,
        id,
        done: todo.done,
      };
    }
    return todo;
  });
  editId = undefined;
  console.log(todoList);

  DOM.render();
};

const SetNewTodoList = (text, done, id = new Date()) => {
  todoList.push({ text, done, id: id.getTime() });
  DOM.render();
};

const RemoveToList = (id) => {
  todoList = todoList.filter((todo) => todo.id != id);
  DOM.render();
};

function clearCompleted() {
  todoList = todoList.filter((todo) => !todo.done);
  DOM.render();
}

const AddToCommple = (id) => {
  todoList = todoList.map((todo) => {
    if (todo.id === id) {
      return {
        text: todo.text,
        done: !todo.done,
        id: todo.id,
      };
    }
    return todo;
  });
  DOM.render();
};

export function App() {
  return DOM.Jsx(
    "div",
    null, // no need for props
    DOM.Jsx(
      "section",
      { className: "todoapp", id: "root" },
      DOM.Jsx(Header),
      DOM.Jsx(
        "main",
        { className: "main", "data-testid": "main" },
        DOM.Jsx(
          "div",
          { className: "toggle-all-container" },
          todoList.length > 0
            ? DOM.Jsx("input", {
                className: "toggle-all",
                type: "checkbox",
                id: "toggle-all",
                "data-testid": "toggle-all",
                onclick: () => {
                  UpdateAll();
                },
              })
            : "",
          todoList.length > 0
            ? DOM.Jsx(
                "label",
                {
                  className: "toggle-all-label",
                  for: "toggle-all",
                  onclick: () => {
                    UpdateAll();
                  },
                },
                "Toggle All Input"
              )
            : ""
        ),

        todoList.length > 0
          ? DOM.Jsx(
              "ul",
              { className: "todo-list", "data-testid": "todo-list" },
              ...todoList.map((todo) =>
                DOM.Jsx(
                  "li",
                  {
                    className: todo.done ? "completed" : "",
                    "data-testid": "todo-item",
                  },
                  DOM.Jsx(
                    "div",
                    { className: "view" },
                    editId != todo.id
                      ? DOM.Jsx("input", {
                          className: "toggle",
                          type: "checkbox",
                          "data-testid": "todo-item-toggle",
                          checked: todo.done,
                          onclick: () => {
                            AddToCommple(todo.id);
                          },
                        })
                      : "",
                    DOM.Jsx(
                      "label",
                      {
                        "data-testid": "todo-item-label",
                        ondblclick: () => {
                          editId = todo.id;
                          DOM.render();
                        },
                        contenteditable: editId == todo.id,
                        onkeydown: (e) => {
                          if (e.code === "Enter") {
                            saveEdit(e.target.textContent, todo.id);
                          }
                        },
                        onblur: () => {
                          editId = undefined;
                          DOM.render();
                        },
                        ref: (el) => {
                          if (editId === todo.id) {
                            el.focus();
                          }
                        },
                      },
                      todo.text
                    ),
                    editId != todo.id
                      ? DOM.Jsx("button", {
                          className: "destroy",
                          "data-testid": "todo-item-button",
                          onclick: () => {
                            RemoveToList(todo.id);
                          },
                        })
                      : ""
                  )
                )
              )
            )
          : ""
      ),
      todoList.length > 0 ? DOM.Jsx(Footer, { filter: "all" }) : ""
    ),
    DOM.Jsx(FooterInfo)
  );
}

export function Active() {
  const filteredTodos = todoList.filter((todo) => {
    return !todo.done;
  });
  return DOM.Jsx(
    "div",
    null,
    DOM.Jsx(
      "section",
      { className: "todoapp", id: "root" },
      DOM.Jsx(Header),

      DOM.Jsx(
        "main",
        { className: "main", "data-testid": "main" },
        DOM.Jsx(
          "div",
          { className: "toggle-all-container" },
          filteredTodos.length > 0
            ? DOM.Jsx("input", {
                className: "toggle-all",
                type: "checkbox",
                id: "toggle-all",
                "data-testid": "toggle-all",
                onclick: () => {
                  UpdateAll();
                },
              })
            : "",
          filteredTodos.length > 0
            ? DOM.Jsx(
                "label",
                {
                  className: "toggle-all-label",
                  for: "toggle-all",
                  onclick: () => {
                    UpdateAll();
                  },
                },
                "Toggle All Input"
              )
            : ""
        ),

        todoList.length > 0
          ? DOM.Jsx(
              "ul",
              { className: "todo-list", "data-testid": "todo-list" },
              ...filteredTodos.map((todo, index) => {
                return DOM.Jsx(
                  "li",
                  {
                    className: todo.done ? "completed" : ``,
                    "data-testid": "todo-item",
                  },
                  DOM.Jsx(
                    "div",
                    { className: "view" },
                    editId != todo.id
                      ? DOM.Jsx("input", {
                          className: "toggle",
                          type: "checkbox",
                          "data-testid": "todo-item-toggle",
                          checked: todo.done,
                          onclick: () => {
                            AddToCommple(todo.id);
                          },
                        })
                      : "",
                    DOM.Jsx(
                      "label",
                      {
                        "data-testid": "todo-item-label",
                        ondblclick: () => {
                          editId = todo.id;
                          DOM.render();
                        },
                        contenteditable: editId == todo.id,
                        onkeydown: (e) => {
                          if (e.code === "Enter") {
                            saveEdit(e.target.textContent, todo.id);
                          }
                        },
                        onblur: () => {
                          editId = undefined;
                          DOM.render();
                        },
                        ref: (el) => {
                          if (editId === todo.id) {
                            el.focus();
                          }
                        },
                      },
                      todo.text
                    ),
                    editId != todo.id
                      ? DOM.Jsx("button", {
                          className: "destroy",
                          "data-testid": "todo-item-button",
                          onclick: () => {
                            RemoveToList(todo.id);
                          },
                        })
                      : ""
                  )
                );
              })
            )
          : ""
      ),

      todoList.length > 0 ? DOM.Jsx(Footer, { filter: "active" }) : ""
    ),
    DOM.Jsx(FooterInfo)
  );
}

export function Completed() {
  const filteredTodos = todoList.filter((todo) => {
    return todo.done;
  });
  return DOM.Jsx(
    "div",
    null,
    DOM.Jsx(
      "section",
      { className: "todoapp", id: "root" },
      DOM.Jsx(Header),

      DOM.Jsx(
        "main",
        { className: "main", "data-testid": "main" },
        DOM.Jsx(
          "div",
          { className: "toggle-all-container" },
          filteredTodos.length > 0
            ? DOM.Jsx("input", {
                className: "toggle-all",
                type: "checkbox",
                id: "toggle-all",
                "data-testid": "toggle-all",
                onclick: () => {
                  UpdateAll();
                },
              })
            : "",
          filteredTodos.length > 0
            ? DOM.Jsx(
                "label",
                {
                  className: "toggle-all-label",
                  for: "toggle-all",
                  onclick: () => {
                    UpdateAll();
                  },
                },
                "Toggle All Input"
              )
            : ""
        ),

        todoList.length > 0
          ? DOM.Jsx(
              "ul",
              { className: "todo-list", "data-testid": "todo-list" },
              ...filteredTodos.map((todo, index) => {
                return DOM.Jsx(
                  "li",
                  {
                    className: todo.done ? "completed" : ``,
                    "data-testid": "todo-item",
                  },
                  DOM.Jsx(
                    "div",
                    { className: "view" },
                    editId != todo.id
                      ? DOM.Jsx("input", {
                          className: "toggle",
                          type: "checkbox",
                          "data-testid": "todo-item-toggle",
                          checked: todo.done,
                          onclick: () => {
                            AddToCommple(todo.id);
                          },
                        })
                      : "",
                    DOM.Jsx(
                      "label",
                      {
                        "data-testid": "todo-item-label",
                        ondblclick: () => {
                          editId = todo.id;
                          DOM.render();
                        },
                        contenteditable: editId == todo.id,
                        onkeydown: (e) => {
                          if (e.code === "Enter") {
                            saveEdit(e.target.textContent, todo.id);
                          }
                        },
                        onblur: () => {
                          editId = undefined;
                          DOM.render();
                        },
                        ref: (el) => {
                          if (editId === todo.id) {
                            el.focus();
                          }
                        },
                      },
                      todo.text
                    ),
                    editId != todo.id
                      ? DOM.Jsx("button", {
                          className: "destroy",
                          "data-testid": "todo-item-button",
                          onclick: () => {
                            RemoveToList(todo.id);
                          },
                        })
                      : ""
                  )
                );
              })
            )
          : ""
      ),

      todoList.length > 0 ? DOM.Jsx(Footer, { filter: "Completed" }) : ""
    ),
    DOM.Jsx(FooterInfo)
  );
}

function Footer({ filter = "all" }) {
  return DOM.Jsx(
    "footer",
    { className: "footer", "data-testid": "footer" },
    DOM.Jsx(
      "span",
      { className: "todo-count" },
      `${lengthTodo()} item(s) left!`
    ),
    DOM.Jsx(
      "ul",
      { className: "filters", "data-testid": "footer-navigation" },
      DOM.Jsx(
        "li",
        {},
        DOM.Jsx(
          "Link",
          { className: `${filter === "all" ? "selected" : ""}`, href: "/" },
          "All"
        )
      ),
      DOM.Jsx(
        "li",
        {},
        DOM.Jsx(
          "Link",
          {
            className: `${filter === "active" ? "selected" : ""}`,
            href: "/active",
          },
          "Active"
        )
      ),
      DOM.Jsx(
        "li",
        {},
        DOM.Jsx(
          "Link",
          {
            className: `${filter === "Completed" ? "selected" : ""}`,
            href: "/completed",
          },
          "Completed"
        )
      )
    ),
    DOM.Jsx(
      "button",
      {
        className: "clear-completed",
        onclick: () => {
          clearCompleted();
        },
      },
      "Clear completed"
    )
  );
}

function Header() {
  const [newTodo, setNewTodo] = DOM.useStates("");
  return DOM.Jsx(
    "header",
    { className: "header", "data-testid": "header" },
    DOM.Jsx("h1", {}, "todos"),
    DOM.Jsx(
      "div",
      { className: "input-container" },
      DOM.Jsx("input", {
        className: "new-todo",
        id: "todo-input",
        type: "text",
        "data-testid": "text-input",
        placeholder: "What needs to be done?",
        onkeydown: (e) => {
          if (e.code === "Enter") {
            SetNewTodoList(newTodo, false);
            e.target.value = "";
            setNewTodo("");
          } else {
            setNewTodo(e.target.value);
          }
        },
        value: newTodo,
      }),
      DOM.Jsx(
        "label",
        {
          className: "visually-hidden",
          for: "todo-input",
        },
        "New Todo Input"
      )
    )
  );
}

export function FooterInfo() {
  return DOM.Jsx(
    "footer",
    { className: "info" },
    DOM.Jsx("p", {}, "Double-click to edit a todo"),
    DOM.Jsx("p", {}, "Created by the mini framework Team"),
    DOM.Jsx(
      "p",
      {},
      "Part of ",
      DOM.Jsx("a", { href: "http://todomvc.com" }, "TodoMVC")
    )
  );
}
