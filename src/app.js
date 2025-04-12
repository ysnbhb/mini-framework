import { DOM } from "./dom.js";
import { Router } from "./router.js";

function Count({ start }) {
  const [count, setCount] = DOM.useStates(start);
  return DOM.Jsx(
    "p",
    {
      onclick: () => {
        setCount(count +1);
      },
    },
    count
  );
}

export function App() {
  const [text, setText] = DOM.useStates("js");
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
    DOM.Jsx("Link", { href: "/lo" }, "click here "),
    DOM.Jsx(Count, { start: 0 })
  );
}

const router = new Router();
router.defined("/", App);
router.init();
