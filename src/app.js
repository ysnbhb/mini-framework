import { router } from "./router.js";
import { Active, Completed, TodoApp, TodoApp2 } from "./todo.js";

router.defined("/", TodoApp2, ["/style/app.css"]);
// router.defined("/app", TodoApp2, ["/style/app.css"]);
router.defined("/active", Active, ["/style/app.css"]);
router.defined("/completed", Completed, ["/style/app.css"]);
router.init();



