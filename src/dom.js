import NotFound from "./notFound.js";
import { router } from "./router.js";

export const DOM = (function () {
  let states = [];
  let statesIndex = 0;
  function useStates(initiaValue) {
    const currentIndex = statesIndex;
    states[currentIndex] =
      states[currentIndex] !== undefined ? states[currentIndex] : initiaValue;
    function setSatates(newValue) {
      states[currentIndex] = newValue;
      render();
    }
    statesIndex++;
    return [states[currentIndex], setSatates];
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
        history.pushState("", null, element.href);
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
      } else if (name === "__htmldanger") {
        element.innerHTML = value;
      } else {
        element.setAttribute(name, value);
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

  function render() {
    statesIndex = 0;
    effectIndex = 0;
    function getPath() {
      return document.location.pathname;
    }
    const func = router.routes[getPath()].func;
    const root = document.querySelector("#root");
    const style = router.routes[getPath()].style;
    replacestyle(style);
    if (func === undefined) {
      root.replaceChildren(CreateElement(NotFound()));
      return;
    }
    root.replaceChildren(CreateElement(func()));
  }

  function replacestyle(styles = []) {
    const links = document.querySelectorAll("link[rel='stylesheet']");
    links.forEach((link) => link.remove());
    for (let href of styles) {
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", href);
      document.head.appendChild(link);
    }
  }
  return { useStates, UseEffect, render, Jsx, CreateElement };
})();
