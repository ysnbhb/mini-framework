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
  return DOM.Jsx(
    "div",
    { className: "good" },
    arrs.map((data, i) => {
      return DOM.Jsx(
        "h1",
        { className: data.tag },
        data.text
      );
    })
  );
}

router.defined("/", Data );

