import NotFound from "./notFound.js";
import { Navigate, router } from "./router.js";

export const DOM = (function () {
  let states = [];
  let statesIndex = 0;
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

  let effect = [];
  let effectIndex = 0;
  function UseEffect(callBack, defpen) {
    const oldDepn = effect[effectIndex];
    let hasCahnged = true;
    if (oldDepn) {
      hasCahnged = defpen.some((dep, i) => !Object.is(dep, oldDepn[i]));
    }
    if (hasCahnged) {
      callBack();
    }
    effect[effectIndex] = defpen;
    effectIndex++;
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
        // ✅ Proper DOM property assignment
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
    console.log("Rendering...");

    statesIndex = 0;
    effectIndex = 0;

    const getPath = () => document.location.pathname;
    const rout = router.routes[getPath()];
    const root = document.querySelector("#root");
    console.log(rout, "current style", currentStyles);

    if (rout === undefined) {
      replacestyle(["./style/notFound.css"]);
      currentStyles = ["./style/notFound.css"];
      root.replaceChildren(CreateElement(NotFound()));
      return;
    }
    replacestyle(rout.styles);
    currentStyles = rout.styles;

    root.replaceChildren(CreateElement(rout.func()));
  }

  function replacestyle(styles = []) {
    console.log("Applying styles:", styles);

    const links = document.querySelectorAll("link[rel='stylesheet']");
    links.forEach((link) => {
      const style = link.href.slice(document.location.origin.length)

      if (styles.includes(style)) {
        return
      }

      link.remove()

    }
    );

    for (let href of styles) {
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", href);
      document.head.appendChild(link);
    }
  }

  return { useStates, UseEffect, render, Jsx, CreateElement };
})();
