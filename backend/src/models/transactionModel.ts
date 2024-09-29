import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../types/type";
import { Transaction } from "../config/db";

export const transactionSchema = new Schema<ITransaction>({

    book_name: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },

    user_name: {
        type: String,
    },

    status: {
        type: String,
        enum: ['ISSUED', 'RETURNED'],
        default: 'ISSUED',
        required: true
    },

    rent: {
        type: Number,
        required: true,
    },

    issue_date: {
        type: Date,
        required: true,
    },

    return_date: {
        type: Date,
    }

});

export { Transaction };