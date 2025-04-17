import { DOM } from "./dom.js";

let todoList = [
  {text : "hhhhh" , done : true , id : 10}
];

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
          className: `clear-completed ${filter === "completed" ? "visible" : "hidden"
            }`,
          onClick: clearCompleted,
        },
        "Clear Completed"
      )
    )
  );
}


function lengthTodo() {
  return todoList.filter(todo => !todo.done).length
}

function TodoActive() {
  return todoList.some(todo => !todo.done)
}


function UpdateAll() {
  let done 
  if (!TodoActive()){
    done = false
  }else {
    done= true
  }
  todoList = todoList.map(todo => {
    return {
      text: todo.text,
      id: todo.id,
      done,
    }
  })
  DOM.render()
}

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
  DOM.render()
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

export function TodoApp2() {
  return DOM.Jsx(
    "section",
    { className: "todoapp", id: "root" },
    DOM.Jsx(
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
            console.log(document.getElementById("todo-input").value);

            if (e.code === "Enter") {
              SetNewTodoList(e.target.value, false);
            }
          },
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
    ),

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
              UpdateAll()
            }
          })
          : "",
        todoList.length > 0
          ? DOM.Jsx(
            "label",
            {
              className: "toggle-all-label",
              for: "toggle-all",
              onclick: () => {
                UpdateAll()
              }
            },
            "Toggle All Input"
          )
          : ""
      ),

      todoList.length > 0
        ? DOM.Jsx(
          "ul",
          { className: "todo-list", "data-testid": "todo-list" },
          ...todoList.map((todo) => {
            return DOM.Jsx(
              "li",
              {
                className: todo.done ? "completed" : "",
                "data-testid": "todo-item",
              },
              DOM.Jsx(
                "div",
                { className: "view" },
                DOM.Jsx("input", {
                  className: "toggle",
                  type: "checkbox",
                  "data-testid": "todo-item-toggle",
                  checked: todo.done,
                  onclick: () => {
                    AddToCommple(todo.id);
                  },
                }),
                DOM.Jsx(
                  "label",
                  { 
                    "data-testid": "todo-item-label",
                    ondblclick: (e) => {
                      console.log("double clicked");
                      
                      const li = e.target.closest('li');
                      li.classList.add('editing');
                      
                      const input = document.createElement('input');
                      input.className = 'edit';
                      input.value = todo.text;
                      li.appendChild(input);
                      
                      input.focus();
                      input.setSelectionRange(0, input.value.length);
                      
                      const saveEdit = () => {
                        const newText = input.value.trim();
                        if (newText !== '') {
                          todo.text = newText;
                        }
                        li.classList.remove('editing');
                        li.removeChild(input);
                        DOM.render();
                      };
                      
                      input.addEventListener('blur', saveEdit);
                      input.addEventListener('keydown', (e) => {
                        if (e.code === 'Enter') {
                          saveEdit();
                        } else if (e.code === 'Escape') {
                          li.classList.remove('editing');
                          li.removeChild(input);
                          DOM.render();
                        }
                      });
                    },
                  },
                  todo.text
                ),
                DOM.Jsx("button", {
                  className: "destroy",
                  "data-testid": "todo-item-button",
                  onclick: () => {
                    RemoveToList(todo.id);
                  },
                })
              )
            );
          })
        )
        : ""
    ),

    todoList.length > 0
      ? DOM.Jsx(
        "footer", { className: "footer", "data-testid": "footer" },
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
            DOM.Jsx("Link", { className: "selected", href: "/" }, "All")
          ),
          DOM.Jsx(
            "li",
            {},
            DOM.Jsx("Link", { className: "", href: "/active" }, "Active")
          ),
          DOM.Jsx(
            "li",
            {},
            DOM.Jsx(
              "Link",
              { className: "", href: "/completed" },
              "Completed"
            )
          )
        ),
        DOM.Jsx(
          "button",
          {
            className: "clear-completed",
            onclick: () => {
              clearCompleted()
            }
          },
          "Clear completed"
        )
      )
      : ""
  );
}

export function Active() {
  const filteredTodos = todoList.filter((todo) => {
    return !todo.done;
  });
  return DOM.Jsx(
    "section",
    { className: "todoapp", id: "root" },
    DOM.Jsx(
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
            console.log(document.getElementById("todo-input").value);

            if (e.code === "Enter") {
              SetNewTodoList(e.target.value, false);
            }
          },
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
    ),

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
              UpdateAll()
            }
          })
          : "",
        filteredTodos.length > 0
          ? DOM.Jsx(
            "label",
            {
              className: "toggle-all-label",
              for: "toggle-all",
              onclick: () => {
                UpdateAll()
              }
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
                className: todo.done ? "completed" : "",
                "data-testid": "todo-item",
              },

              DOM.Jsx(
                "div",
                { className: "view" },
                DOM.Jsx("input", {
                  className: "toggle",
                  type: "checkbox",
                  "data-testid": "todo-item-toggle",
                  checked: todo.done,
                  onclick: () => {
                    AddToCommple(todo.id);
                  },
                }),
                DOM.Jsx(
                  "label",
                  { "data-testid": "todo-item-label",
                    ondblclick: () => {
                      console.log("double clicked");
                    },
                   },
                  todo.text
                ),
                DOM.Jsx("button", {
                  className: "destroy",
                  "data-testid": "todo-item-button",
                  onclick: () => {
                    RemoveToList(todo.id);
                  },
                })
              )
            );
          })
        )
        : ""
    ),

    todoList.length > 0
      ? DOM.Jsx(
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
            DOM.Jsx("Link", { className: "", href: "/" }, "All")
          ),
          DOM.Jsx(
            "li",
            {},
            DOM.Jsx("Link", { className: "selected", href: "/active" }, "Active")
          ),
          DOM.Jsx(
            "li",
            {},
            DOM.Jsx(
              "Link",
              { className: "", href: "/completed" },
              "Completed"
            )
          )
        ),
        DOM.Jsx(
          "button",
          {
            className: "clear-completed", onclick: () => {
              clearCompleted()
            }
          },
          "Clear completed"
        )
      )
      : ""
  );
}

export function Completed() {
  const filteredTodos = todoList.filter((todo) => {
    return todo.done;
  });
  return DOM.Jsx(
    "section",
    { className: "todoapp", id: "root" },
    DOM.Jsx(
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
            console.log(document.getElementById("todo-input").value);

            if (e.code === "Enter") {
              SetNewTodoList(e.target.value, false);
            }
          },
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
    ),

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
              UpdateAll()
            }
          })
          : "",
        filteredTodos.length > 0
          ? DOM.Jsx(
            "label",
            {
              className: "toggle-all-label",
              for: "toggle-all",
              onclick: () => {
                UpdateAll()
              }
            },
            "Toggle All Input"
          )
          : ""
      ),

      todoList.length > 0
        ? DOM.Jsx(
          "ul",
          { className: "todo-list", "data-testid": "todo-list" },
          ...filteredTodos.map((todo) => {
            return DOM.Jsx(
              "li",
              {
                className: todo.done ? "completed" : "",
                "data-testid": "todo-item",
              },
              DOM.Jsx(
                "div",
                { className: "view" },
                DOM.Jsx("input", {
                  className: "toggle",
                  type: "checkbox",
                  "data-testid": "todo-item-toggle",
                  checked: todo.done,
                  onclick: () => {
                    AddToCommple(todo.done);
                  },
                }),
                DOM.Jsx(
                  "label",
                  { "data-testid": "todo-item-label",
                    ondblclick: () => {
                      console.log("double clicked");
                    },
                   },
                  todo.text
                ),
                DOM.Jsx("button", {
                  className: "destroy",
                  "data-testid": "todo-item-button",
                  onclick: () => {
                    RemoveToList(todo.id);
                  },
                })
              )
            );
          })
        )
        : ""
    ),

    todoList.length > 0
      ? DOM.Jsx(
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
            DOM.Jsx("Link", { className: "", href: "/" }, "All")
          ),
          DOM.Jsx(
            "li",
            {},
            DOM.Jsx("Link", { className: "", href: "/active" }, "Active")
          ),
          DOM.Jsx(
            "li",
            {},
            DOM.Jsx(
              "Link",
              { className: "selected", href: "/completed" },
              "Completed"
            )
          )
        ),
        DOM.Jsx(
          "button",
          {
            className: "clear-completed", onclick: () => {
              clearCompleted()
            }
          },
          "Clear completed"
        )
      )
      : ""
  );
}
