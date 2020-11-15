import { Router } from "https://deno.land/x/oak/mod.ts";
import bookRouter from "./book.router.ts";

const router = new Router();

router.use("/books", bookRouter.routes());

export default router;
