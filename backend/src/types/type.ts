import { Document } from "mongoose";

//Book Interface
export interface IBook extends Document {
    book_name: string;
    category: string;
    rent_per_day: number;
}

//User Interface
export interface IUser extends Document {
    name: string;
    email: string;
}

//Transaction Interface
export interface ITransaction extends Document {
    book_name: string;
    user_id: string;
    user_name: string;
    status: "ISSUED" | "RETURNED";
    rent: number;
    issue_date: Date;
    return_date: Date;
}