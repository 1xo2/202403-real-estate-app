import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";

export const signupController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { eMail, password, userName } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new UserModel({ eMail, password: hashedPassword, userName });

  try {
    await user.save();
    res.status(201).json("User created successfully");
  } catch (error: any) {
    // Check if the error is a validation error (e.g., unique constraint violation)
    if (error.name === "ValidationError") {
      console.error("ValidationError status(400):", error.message);
      res.status(400).json({ error: error.message });
    } else {
      // Handle other types of errors
      console.error("Error saving user:", error);
      // res.status(500).json({ error: "Internal server error" });
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
      //"E11000 duplicate key error collection"// sanities the error massage
    }
  }
};
