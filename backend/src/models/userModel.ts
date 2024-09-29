import { Schema } from 'mongoose';
import { IUser } from '../types/type';
import { User } from '../config/db';

export const userSchema = new Schema<IUser>({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    }

});

export { User };


