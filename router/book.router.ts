import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
} from "../handlers/book.handlers.ts";

const router = new Router();

router
  .get("/", getBooks)
  .get("/:isbn", getBook)
  .post("/", addBook)
  .put("/:isbn", updateBook)
  .delete("/:isbn", deleteBook);

export default router;
