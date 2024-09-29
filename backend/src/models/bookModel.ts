import { Schema } from "mongoose";
import { IBook } from "../types/type";
import { Book } from "../config/db";

export const bookSchema = new Schema<IBook>({

    book_name: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    rent_per_day: {
        type: Number,
        required: true,
    }

});

export { Book };


