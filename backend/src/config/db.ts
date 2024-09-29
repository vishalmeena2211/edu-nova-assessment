import mongoose, { Model } from 'mongoose';
import { bookSchema } from '../models/bookModel';
import { userSchema } from '../models/userModel';
import { transactionSchema } from '../models/transactionModel';
import { IBook, ITransaction, IUser } from '../types/type';
import dotenv from 'dotenv'

dotenv.config();

//Models Types Assignment
let Book: Model<IBook>, User: Model<IUser>, Transaction: Model<ITransaction>;

export const connectDBs = async () => {
    try {
        // Connect to the database 1st Library DB
        const libraryDB = await mongoose.createConnection(process.env.MONGO_URI || "", {
            dbName: "library_db"
        })
        // Connect to the database 2nd Transaction DB
        const transactionDB = await mongoose.createConnection(process.env.MONGO_URI || "", {
            dbName: "transaction_db"
        })

        console.log("both databases are connected")
        
        //Assigning Models
        Book = libraryDB.model<IBook>("Book", bookSchema);
        User = libraryDB.model<IUser>("User", userSchema);

        Transaction = transactionDB.model("Transaction", transactionSchema);

    } catch (error) {
        console.error(`Error:${error}`)
        process.exit(1)
    }
}

export { Book, User, Transaction }
