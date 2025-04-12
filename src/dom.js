import { App } from "./app.js";

export const DOM = (function () {
  let states = [];
  let statesIndex = [];
  function useStates(initiaValue) {
    const currentIndex = statesIndex;
    states[currentIndex] =
      states[currentIndex] !== undefined ? states[currentIndex] : initiaValue;
    function setSatates(newValue) {
      states[currentIndex] = newValue;
      render();
    }
    return [states[currentIndex], setSatates];
  }

  let effect = [];
  let effectIndex = [];
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

  function Jsx(tag, props = {}, ...childers) {
    if (typeof tag === "function") {
      return { ...props, childers };
    }
    return { tag, props, childers };
  }

  function CreateElement(node) {
    if (typeof node === "string" || typeof node === "number") {
      return document.createTextNode(String(node));
    }
    let element;
    if (node.tag === "Link") {
      element = document.createElement("a");
      element.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState("", null, e.target.href);
        render();
      });
    } else {
      element = document.createElement(node.tag);
    }
    for (let [name, value] of Object.entries(node.props)) {
      if (name.startsWith("on") && typeof value === "function") {
        element.addEventListener(name.slice(2).toLocaleLowerCase(), value);
      } else if (name === "className") {
        element.className = value;
      } else if (name === "id") {
        element.id = value;
      } else {
        element.setAttribute(name, value);
      }
    }
    for (let child of node.childers.flat()) {
      if (typeof child === "string" || typeof child === "number") {
        element.append(document.createTextNode(String(child)));
      } else {
        element.append(CreateElement(child));
      }
    }
    return element;
  }

  function render() {
    statesIndex = 0;
    effectIndex = 0;
    const root = document.querySelector("#root");
    root.innerHTML = "";
    const app = App;
    root.append(CreateElement(app()));
  }

  return { useStates, UseEffect, render, Jsx, CreateElement };
})();
