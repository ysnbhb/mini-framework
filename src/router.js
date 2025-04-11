export class Router {
  constructor() {
    this.rout = {};
    this.document = document;
  }
  render() {
    const path = this.getPath();
    const func = this.rout[path];
    if (!func) {
      return;
    }
    func();
  }
  getPath() {
    return this.document.location.pathname;
  }
  init() {
    this.document.addEventListener("popstate", () => {
      this.render();
    });
    this.render();
  }
  defined(path, func) {
    const func = this.rout[path];
    if (func) {
      throw new Error("path arleady used");
    }
    this.rout[path] = func;
  }
}
