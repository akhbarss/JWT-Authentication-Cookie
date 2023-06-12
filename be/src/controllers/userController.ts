import { Request, Response } from "express";
import User, { UserDocument } from "../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: UserDocument[] = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to get users" });
  }
};
