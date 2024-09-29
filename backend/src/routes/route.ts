import express from "express";
import { getAllBooks, getBookById, createBook, searchBook, searchBookByRent, searchBookByCategory } from "../controllers/bookController";
import { issueBook, returnBook, getBookHistory, getBookRent, getUserBooks, getBooksIssuedInDateRange, getIssuedBooks, getUnIssuedBooks } from "../controllers/transactionController"; // Adjust the path if necessary
import { createUser, getUser, getUsers } from "../controllers/userController";

const router = express.Router();

// Book Routes
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);
router.post("/books", createBook);

//Books Search Routes
router.get("/books/search/name", searchBook);
router.get("/books/search/rent", searchBookByRent);
router.get("/books/search/category", searchBookByCategory);

//User Routes
router.post("/users/create", createUser);
router.get("/users/", getUsers);
router.get("/users/:id", getUser);

// Transaction Query Routes
router.post("/transactions/issue", issueBook);
router.post("/transactions/return", returnBook);
router.post("/transactions/history", getBookHistory);
router.post("/transactions/rent", getBookRent);
router.post("/transactions/user-books", getUserBooks);
router.post("/transactions/date-range", getBooksIssuedInDateRange);
router.get("/transactions/issued-books", getIssuedBooks);
router.get("/transactions/un-issued-books", getUnIssuedBooks);

export default router;