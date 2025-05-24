import NotFound from "./notFound.js";
import { Navigate, router } from "./router.js";
let id = 0;
export const DOM = (function () {
  let states = [];
  let statesIndex = 0;
  let CurrentDom;
  const root = document.querySelector("#root");
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

  function CreateElement(container = root, node) {
    if (node === undefined || !node) {
      const textNode = document.createTextNode("");
      container.append(textNode);
      return textNode;
    }
    if (typeof node === "string" || typeof node === "number") {
      const textNode = document.createTextNode(String(node));

      container.append(textNode);
      return textNode;
    }

    let element;
    if (node.tag === "Link") {
      element = document.createElement("a");
      element.onclick = (e) => {
        e.preventDefault();
        const rout = Navigate();
        rout.push(element.href);
      };
    } else {
      element = document.createElement(node.tag);
    }
    node.props = node.props || {};
    for (let [name, value] of Object.entries(node.props)) {
      if (name.startsWith("on") && typeof value === "function") {
        const eventName = name.slice(2).toLowerCase();
        element[`on${eventName}`] = value;
      } else if (name === "className") {
        element.className = value;
      } else if (name === "id") {
        element.id = value;
      } else if (name === "ref") {
        if (typeof value === "function") value(element);
        else value.current = element;
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
    node.childeren = node.childeren || [];
    for (let child of node.childeren.flat()) {
      CreateElement(element, child);
    }
    container.append(element);
    return element;
  }

  function render() {
    statesIndex = 0;
    const getPath = () => document.location.pathname;
    const rout = router.routes[getPath()];
    if (rout === undefined) {
      const DOm = NotFound();
      updateElement(root.children[0], CurrentDom, DOm);
      replacestyle(["./style/notFound.css"]);
      CurrentDom = DOm;
      return;
    }
    // console.log(root.children);

    const Dom = rout.func();
    replacestyle(rout.styles);

    updateElement(root.children[0], CurrentDom, Dom);
    CurrentDom = Dom;
  }

  function replacestyle(styles = []) {
    const links = document.querySelectorAll("link[rel='stylesheet']");
    const linksStyle = [];
    links.forEach((link) => {
      const style = link.href.slice(document.location.origin.length);

      if (styles.includes(style)) {
        linksStyle.push(style);
        return;
      }
      link.remove();
    });

    for (let href of styles) {
      if (linksStyle.includes(href)) {
        continue;
      }
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", href);
      document.head.appendChild(link);
    }
  }

  function updateAttributes(element, oldAttrs, newAttrs) {
    oldAttrs = oldAttrs || {};
    newAttrs = newAttrs || {};

    Object.entries(oldAttrs).forEach(([key, _]) => {
      if (key.startsWith("on")) {
        const eventName = key.toLowerCase();
        if (!newAttrs[eventName]) {
          element[eventName] = null;
        }
      } else if (!(key in newAttrs)) {
        element.removeAttribute(key);
      }
    });
    Object.entries(newAttrs).forEach(([key, value]) => {
      if (oldAttrs[key] === value) return;

      if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.toLowerCase();
        element[eventName] = value;
      } else if (key === "className") {
        element.className = value;
      } else if (typeof value === "boolean") {
        element[key] = value;

        if (value) {
          element.setAttribute(key, "");
        } else {
          element.removeAttribute(key);
        }
      } else {
        if (key === "ref") {
          if (typeof value === "function") value(element);
          else value.current = element;
        } else {
          element.setAttribute(key, value);
        }
      }
    });
  }

  function updateElement(realElement, oldVDom, newVDom) {
    id++;
    //
    if (!oldVDom || oldVDom.tag !== newVDom.tag) {      
      const newElement = DOM.CreateElement(realElement, newVDom);
      realElement?.parentNode?.replaceChild(newElement, realElement);
      return;
    }
    updateAttributes(realElement, oldVDom.props, newVDom.props);
    updateChildren(realElement, oldVDom.childeren, newVDom.childeren);
  }

  function updateChildren(element, oldChildren, newChildren) {
    oldChildren = oldChildren || [];
    newChildren = newChildren || [];

    const oldKeys = new Map();
    oldChildren.forEach((child, index) => {
      if (typeof child !== "string" && child.props?.key) {
        oldKeys.set(child.props.key, {
          vdom: child,
          element: element.childNodes[index],
        });
      }
    });

    // Remove old children whose keys are not in newChildren
    const newKeys = new Set(
      newChildren
        .filter((c) => typeof c !== "string" && c?.props?.key)
        .map((c) => c.attrs.key)
    );
    oldKeys.forEach((value, key) => {
      if (!newKeys.has(key)) {
        element.removeChild(value.element);
      }
    });

    // Update or insert children at each position

    newChildren.forEach((newChild, i) => {
      let realChild = element.childNodes[i];

      if (typeof newChild === "string") {
        if (realChild && realChild.nodeType === Node.TEXT_NODE) {
          if (realChild.textContent !== newChild) {
            realChild.textContent = newChild;
          }
        } else {
          const textNode = document.createTextNode(newChild);
          if (realChild) {
            element.replaceChild(textNode, realChild);
          } else {
            element.appendChild(textNode);
          }
        }
      } else {
        const newKey = newChild.props?.key;
        if (newKey) {
          const oldEntry = oldKeys.get(newKey);
          if (oldEntry) {
            const oldElement = oldEntry.element;
            if (oldElement !== realChild) {
              element.insertBefore(oldElement, realChild);
              realChild = oldElement;
            }
            updateElement(realChild, oldEntry.vdom, newChild);
          } else {
            const newElement = CreateElement(element, newChild);
            if (realChild) {
              element.insertBefore(newElement, realChild);
            } else {
              element.appendChild(newElement);
            }
          }
        } else {
          // Handle non-keyed elements
          if (realChild && realChild.nodeType === Node.ELEMENT_NODE) {
            const oldChild = oldChildren[i];
            if (
              typeof oldChild === "object" &&
              oldChild.tag === newChild.tag &&
              !oldChild.props?.key
            ) {
              updateElement(realChild, oldChild, newChild);
            } else {
              const newElement = CreateElement(element, newChild);
              element.replaceChild(newElement, realChild);
            }
          } else {
            const newElement = CreateElement(element, newChild);
            if (realChild) {
              element.replaceChild(newElement, realChild);
            } else {
              element.appendChild(newElement);
            }
          }
        }
      }
    });
    while (element.childNodes.length > newChildren.length) {
      element.removeChild(element.lastChild);
    }
  }

  return { useStates, render, Jsx, CreateElement, updateElement };
})();
