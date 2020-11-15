import { Request, Response, RouteParams } from "https://deno.land/x/oak/mod.ts";
import { Book } from "../models/book.ts";
import { BOOKS } from "../db/books.ts";

export const getBooks = async ({ response }: { response: Response }) => {
  response.status = 200;
  response.body = BOOKS;
};

export const getBook = async ({
  params,
  response,
}: {
  params: RouteParams;
  response: Response;
}) => {
  const isbn = params.isbn;

  if (!isbn) {
    response.status = 400;
    response.body = { msg: "ISBN was not provided" };
    return;
  }

  const book: Book | undefined = BOOKS.find((b: Book) => b.isbn === isbn);

  if (!book) {
    response.status = 404;
    response.body = { msg: "Book not found" };
    return;
  }

  response.status = 200;
  response.body = book;
};

export const addBook = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  if (!request.hasBody) {
    response.status = 400;
    response.body = { msg: "Invalid book data" };
    return;
  }

  const { isbn, name, pages, author } = await request.body({ type: "json" })
    .value;

  if (!isbn || !name || !pages || !author) {
    response.status = 422;
    response.body = {
      msg: "Incorrect book data. ISBN, name, pages and author are required",
    };
    return;
  }

  const book: Book | undefined = BOOKS.find((b: Book) => b.isbn === isbn);
  if (book) {
    response.status = 409;
    response.body = {
      msg: `ISBN ${isbn} already exists`,
    };
    return;
  }

  const newBook: Book = {
    isbn,
    name,
    pages,
    author,
  };

  BOOKS.push(newBook);

  response.body = { msg: "Book created", dto: newBook };
};

export const updateBook = async ({
  params,
  request,
  response,
}: {
  params: RouteParams;
  request: Request;
  response: Response;
}) => {
  const isbn = params.isbn;

  if (!isbn) {
    response.status = 400;
    response.body = { msg: "Invalid ISBN" };
    return;
  }

  if (!request.hasBody) {
    response.status = 400;
    response.body = { msg: "Invalid book data" };
    return;
  }

  const book: Book | undefined = BOOKS.find((b: Book) => b.isbn === isbn);
  if (!book) {
    response.status = 404;
    response.body = { msg: "Book not found" };
    return;
  }

  const { name, pages, author } = await request.body({ type: "json" }).value;

  book.name = name && name !== "" ? name : book.name;
  book.pages = pages && pages > 0 ? pages : book.pages;
  book.author = author && author !== "" ? author : book.author;

  response.status = 200;
  response.body = { msg: "Book updated" };
};

export const deleteBook = async ({
  params,
  response,
}: {
  params: RouteParams;
  response: Response;
}) => {
  const isbn = params.isbn;

  if (!isbn) {
    response.status = 400;
    response.body = { msg: "ISBN was not provided" };
    return;
  }

  const book: Book | undefined = BOOKS.find((b: Book) => b.isbn === isbn);
  if (!book) {
    response.status = 404;
    response.body = { msg: "Book not found" };
    return;
  }

  const bookIndex = BOOKS.findIndex((b: Book) => b.isbn === isbn);
  BOOKS.splice(bookIndex, 1);

  response.status = 200;
  response.body = { msg: "Book deleted", dto: book };
};
