import { DOM } from "./dom.js";
import { router } from "./router.js";
import { TodoApp } from "./todo.js";

router.defined("/", TodoApp, ["./style/todo.css"]);


