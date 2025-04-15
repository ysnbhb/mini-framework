import { router } from "./router.js";
import { TodoApp, TodoApp2 } from "./todo.js";

router.defined("/", TodoApp, ["./style/todo.css"]);
router.defined("/app", TodoApp2, ["./style/app.css"]);
router.init();



