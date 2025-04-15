import { DOM } from "./dom.js";


export class Router {
  constructor() {
    this.routes = {};
  }
  init() {
    window.addEventListener("popstate", () => {
      DOM.render();
    });
    document.addEventListener("DOMContentLoaded" , ()=> {
      DOM.render();
    })
  }
  defined(path, func, styles) {
    const existing = this.routes[path];
    if (existing) {
      throw new Error("path already used");
    }
    this.routes[path] = {
      func,
      styles 
    };
   
  }
}

export const Navigate = function () {
  function push(url) {
    history.pushState("", null, url);
    DOM.render();
  }
  function replace(url) {
    history.replaceState("", null, url);
    DOM.render();
  }
  function go(num) {
    history.go(num);
    DOM.render();
  }
  function back() {
    history.back();
    DOM.render();
  }
  function forward() {
    history.forward();
    DOM.render();
  }
  function reload() {
    location.reload();
  }
  return { push, replace, go, back, forward, reload };
};


export const router = new Router();
router.init();