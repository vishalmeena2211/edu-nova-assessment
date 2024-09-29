import { User } from "../models/userModel";
import { Request, Response } from "express";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
}

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
}

// Get a single user by ID
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}
