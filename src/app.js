import { DOM } from "./dom.js";

export function App() {
  const [text, setText] = DOM.useStates("ji");
  return DOM.Jsx(
    "h1",
    { className: "doo" },
    "doo",
    DOM.Jsx("p", {}, text),
    DOM.Jsx(
      "button",
      {
        onClick: (e) => {
          setText("jjjjf");
        },
      },
      "click her"
    ),
    DOM.Jsx("Link", { href: "/lo" }, "click here ")
  );
}

DOM.render();
