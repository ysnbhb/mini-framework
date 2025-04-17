import { router } from "./router.js";
import { Active, Completed, App } from "./todo.js";

router.defined("/", App, ["/style/app.css"]);
router.defined("/active", Active, ["/style/app.css"]);
router.defined("/completed", Completed, ["/style/app.css"]);
router.init();



