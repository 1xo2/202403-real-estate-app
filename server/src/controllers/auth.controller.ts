import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { eMail, password, userName } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new UserModel({ eMail, password: hashedPassword, userName });

  try {
    await user.save();
    res.status(201).json("User created successfully");
  } catch (error: any) {
    // Set status code to 500 and pass the error to the error handling middleware
    res.status(500);
    next(error);
  }  
};
