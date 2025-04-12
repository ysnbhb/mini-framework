import { DOM } from "./dom.js";

export const rout = {};

export class Router {
  constructor() {
    this.document = document;
  }
  init() {
    this.document.addEventListener("popstate", () => {
      DOM.render();
    });
    DOM.render();
  }
  defined(path, func) {
    const fun = rout[path];
    if (fun) {
      throw new Error("path arleady used");
    }
    rout[path] = func;
  }
}

const Navigate = function () {
  function push(url) {
    history.pushState("", null, url);
    DOM.render();
  }

  function replace(url) {
    history.replaceState("", null, url);
    DOM.render();
  }
};
