import { DOM } from "./dom.js";
import { router } from "./router.js";

const arrs = [
  {
    tag: "h1",
    className: "good",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
  {
    tag: "h1",
    className: "good",
    text: "hh",
  },
];

function Data() {
  const [count, setCount] = DOM.useStates(0);
  return DOM.Jsx(
    "div",
    {
      className: "container",
    },
    DOM.Jsx(
      "button",
      {
        onClick: () => {
          setCount(count + 1);
        },
      },
      "click me"
    ),
    DOM.Jsx(
      "h1",
      {
        className: "good",
      },
      count
    ),
    ...arrs.map((item) => {
      return DOM.Jsx(
        item.tag,
        {
          className: item.className,
        },
        item.text
      );
    })
  );
}

router.defined("/", Data);
