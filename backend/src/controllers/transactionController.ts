import { Request, Response } from 'express';
import { Transaction } from '../config/db';
import { User } from '../models/userModel';
import { Book } from '../models/bookModel';
import { IBook, IUser, ITransaction } from '../types/type';

// Issue book
export const issueBook = async (req: Request, res: Response) => {
    try {
        const { bookName, userId, issueDate } = req.body;

        // Validate user
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            res.status(400).json({ message: 'Invalid user' });
            return;
        }

        // Validate book
        const book: IBook | null = await Book.findOne({ book_name: bookName });
        if (!book) {
            res.status(400).json({ message: 'Invalid book' });
            return;
        }

        // Create new transaction
        const transaction = new Transaction({
            book_name: book.book_name,
            user_id: userId,
            user_name: user.name,
            issue_date: issueDate,
            status: 'ISSUED',
            rent: 0, // Assuming rent is calculated on return
            return_date: null // Assuming return date is null initially
        });

        await transaction.save();
        res.status(201).json({ message: 'Book issued successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

//Return book
export const returnBook = async (req: Request, res: Response) => {
    try {
        const { bookName, userId, returnDate } = req.body;

        // Validate user
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            res.status(400).json({ message: 'Invalid user' });
            return;
        }

        // Validate book
        const book: IBook | null = await Book.findOne({ book_name: bookName });
        if (!book) {
            res.status(400).json({ message: 'Invalid book' });
            return;
        }

        // Find the transaction
        const transaction: ITransaction | null = await Transaction.findOne({ book_name: book.book_name, user_id: userId, status: 'ISSUED' });
        if (!transaction) {
            res.status(400).json({ message: 'No active transaction found for this book and user' });
            return;
        }

        // Calculate rent
        const issueDate = new Date(transaction.issue_date);
        const returnDateObj = new Date(returnDate);
        const rentDays = Math.ceil((returnDateObj.getTime() - issueDate.getTime()) / (1000 * 3600 * 24));
        const rent = rentDays * book.rent_per_day;

        if (rentDays < 0) {
            res.status(400).json({ message: 'Return date cannot be before issue date' });
            return;
        }

        // Update transaction
        transaction.return_date = returnDate;
        transaction.status = 'RETURNED';
        transaction.rent = rent;

        await transaction.save();
        res.status(200).json({ message: 'Book returned successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

// Get all transactions history of a book
export const getBookHistory = async (req: Request, res: Response) => {
    try {
        const { bookName } = req.body;

        // Validate book
        const book: IBook | null = await Book.findOne({ book_name: bookName });
        if (!book) {
            res.status(400).json({ message: 'Invalid book' });
            return;
        }

        // Get all transactions for the book
        const transactions: ITransaction[] = await Transaction.find({ book_name: book.book_name });

        // Get currently issued transaction
        const currentlyIssued = transactions.find(transaction => transaction.status === 'ISSUED');

        res.status(200).json({
            totalIssuedCount: transactions.length,
            currentlyIssued: currentlyIssued ? currentlyIssued.user_name : 'Not issued at the moment',
            history: transactions
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

// Get total rent for a book
export const getBookRent = async (req: Request, res: Response) => {
    try {
        const { bookName } = req.body;

        // Validate book
        const book: IBook | null = await Book.findOne({ book_name: bookName });
        if (!book) {
            res.status(400).json({ message: 'Invalid book' });
            return;
        }

        // Get all transactions for the book
        const transactions: ITransaction[] = await Transaction.find({ book_name: book.book_name });

        // Calculate total rent
        const totalRent = transactions.reduce((sum, transaction) => sum + transaction.rent, 0);

        res.status(200).json({ totalRent });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

// Get all books issued to a user
export const getUserBooks = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        // Validate user
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            res.status(400).json({ message: 'Invalid user' });
            return;
        }

        // Get all transactions for the user
        const transactions: ITransaction[] = await Transaction.find({ user_id: userId });

        res.status(200).json({ books: transactions });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

//Get books issued in a date range
export const getBooksIssuedInDateRange = async (req: Request, res: Response) => {
    try {
        const { from, to } = req.body;

        // Convert dates to Date objects and set time to 00:00:00 for start and 23:59:59 for end
        const start = new Date(from);
        start.setHours(0, 0, 0, 0);
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);

        // Get all transactions within the date range
        const transactions: ITransaction[] = await Transaction.find({
            issue_date: { $gte: start, $lte: end }
        });

        res.status(200).json({
            transactions: transactions.map(transaction => ({
                book_name: transaction.book_name,
                user_name: transaction.user_name,
                issue_date: transaction.issue_date
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

// Get Issued Books
export const getIssuedBooks = async (req: Request, res: Response) => {
    try {
        // Get all transactions within the date range
        const transactions: ITransaction[] = await Transaction.find({
            status: 'ISSUED'
        });

        res.status(200).json({
            transactions: transactions.map(transaction => ({
                book_name: transaction.book_name,
                user_name: transaction.user_name,
                user_id: transaction.user_id,
                issue_date: transaction.issue_date
            }))

        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

// Get UnIssued Books
export const getUnIssuedBooks = async (req: Request, res: Response) => {
    try {
        // Get all transactions within the date range
        const issuedBooks: ITransaction[] = await Transaction.find({
            status: 'ISSUED'
        });

        const issuedBooksNames = issuedBooks.map(issuedBook => issuedBook.book_name);

        const unIssuedBooks: IBook[] = await Book.find({
            book_name: { $nin: issuedBooksNames }
        });

        res.status(200).json({
            books: unIssuedBooks
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}