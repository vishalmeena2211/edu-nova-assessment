import { Request, Response } from 'express';
import { Book } from '../models/bookModel';

// Get all books
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

// Get a single book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

// Create a new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { book_name, category, rent_per_day } = req.body;

        const newBook = await Book.create({
            book_name,
            category,
            rent_per_day
        });

        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};

//search by name or term
export const searchBook = async (req: Request, res: Response): Promise<void> => {
    const { term } = req.query;
    try {
        const books = await Book.find({ book_name: { $regex: term, $options: 'i' } });
        if (books.length > 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ message: 'No books found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}

//search by rent price range
export const searchBookByRent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { min, max } = req.query;
        const books = await Book.find({ rent_per_day: { $gte: min, $lte: max } });
        if (books.length > 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ message: 'No books found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}

//list of books with matching values category + name/term + rent per day(range)
export const searchBookByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, term, min, max } = req.query;
        const books = await Book.find({ category: category, book_name: { $regex: term, $options: 'i' }, rent_per_day: { $gte: min, $lte: max } });
        if (books.length > 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ message: 'No books found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}


