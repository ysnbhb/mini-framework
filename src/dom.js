import NotFound from "./notFound.js";
import { Navigate, router } from "./router.js";

export const DOM = (function () {
  let states = [];
  let statesIndex = 0;
  let CurrentDom
  const root = document.querySelector("#root")
  function useStates(initialValue) {
    const currentIndex = statesIndex;
    states[currentIndex] =
      states[currentIndex] !== undefined ? states[currentIndex] : initialValue;

    function setStates(newValue) {
      if (typeof newValue === "function") {
        states[currentIndex] = newValue(states[currentIndex]);
      } else {
        states[currentIndex] = newValue;
      }
      DOM.render();
    }

    statesIndex++;
    return [states[currentIndex], setStates];
  }
  function Jsx(tag, props, ...childeren) {
    if (typeof tag === "function") {
      return tag({ ...props, childeren });
    }
    return { tag, props: props || {}, childeren };
  }

  function CreateElement(node) {
    if (node === undefined || !node) {
      return document.createTextNode("");
    }
    if (typeof node === "string" || typeof node === "number") {
      return document.createTextNode(String(node));
    }

    let element;
    if (node.tag === "Link") {
      element = document.createElement("a");
      element.addEventListener("click", (e) => {
        e.preventDefault();
        const rout = Navigate();
        rout.push(element.href);
      });
    } else {
      element = document.createElement(node.tag);
    }

    for (let [name, value] of Object.entries(node.props)) {
      if (name.startsWith("on") && typeof value === "function") {
        const eventName = name.slice(2).toLowerCase();
        element[`on${eventName}`] = value;
      } else if (name === "className") {
        element.className = value;
      } else if (name === "id") {
        element.id = value;
      } else if (name === "__htmldanger") {
        element.innerHTML = value;
      } else {
        if (typeof value === "boolean") {
          if (value) {
            element.setAttribute(name, "");
            element[name] = true;
          } else {
            element.removeAttribute(name);
            element[name] = false;
          }
        } else {
          if (name in element) {
            element[name] = value;
          } else {
            element.setAttribute(name, value);
          }
        }
      }
    }

    for (let child of node.childeren.flat()) {
      if (typeof child === "string" || typeof child === "number") {
        element.append(document.createTextNode(String(child)));
      } else {
        element.append(CreateElement(child));
      }
    }

    return element;
  }

  let currentStyles = [];

  function render() {
    statesIndex = 0;
    const getPath = () => document.location.pathname;
    const rout = router.routes[getPath()];
    if (rout === undefined) {
      replacestyle(["./style/notFound.css"]);
      currentStyles = ["./style/notFound.css"];
      const DOm = NotFound()
      console.log(DOm);
      
      root.replaceChildren(CreateElement(NotFound()));
      CurrentDom = DOm
      return;
    }
    replacestyle(rout.styles);
    currentStyles = rout.styles;
    console.log(root.children[0]);
    const Dom = rout.func()
    console.log(Dom);
    
    root.replaceChildren(CreateElement(rout.func()));
    CurrentDom = Dom
  }

  function replacestyle(styles = []) {
    const links = document.querySelectorAll("link[rel='stylesheet']");
    const linksStyle = []
    links.forEach((link) => {
      const style = link.href.slice(document.location.origin.length)

      if (styles.includes(style)) {
        linksStyle.push(style)
        return
      }
      link.remove()
    }
    );

    for (let href of styles) {
      if (linksStyle.includes(href)) {
        continue
      }
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", href);
      document.head.appendChild(link);
    }
  }

  return { useStates, render, Jsx, CreateElement };
})();
