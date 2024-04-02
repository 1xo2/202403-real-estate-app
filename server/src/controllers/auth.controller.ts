import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";
import errorHandler from "../middleware/errorHandling/errorHandler";
import jwt from "jsonwebtoken";

interface User extends Document {
  userName?: string;
  eMail?: string;
  password?: string;
}

////////////
// Register
//////////
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { eMail, password, userName } = req.body;

  // console.log('req.body:', req.body)
  // console.log("\nuserName:", userName);
  // console.log("\npassword:", password);
  // console.log("\neMail:", eMail);

  if (
    isNull_Undefined_emptyString(userName) ||
    isNull_Undefined_emptyString(password) ||
    isNull_Undefined_emptyString(eMail)
  ) {
    return next(errorHandler("request.body is not ok", "err:sad9f80sd", 500));
  }

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
////////////
// LogIn
//////////
export const logInController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { eMail, password } = req.body;

  // console.log('req.body:', req.body)
  // console.log("\nuserName:", userName);
  // console.log("\npassword:", password);
  // console.log("\neMail:", eMail);
  try {
    if (
      isNull_Undefined_emptyString(password) ||
      isNull_Undefined_emptyString(eMail)
    ) {
      return next(errorHandler("request.body is not ok", "err:df0fpp", 500));
    }

    const validUser = await UserModel.findOne({ eMail });
    if (!validUser)
      return next(errorHandler("User not found", "signIn-x", 500));

    const validPassword = bcrypt.compareSync(
      password,
      validUser.password as string
    );

    if (!validPassword)
      return next(errorHandler("Wrong Credentials", "signIn-d", 401));

    const token = jwt.sign(
      { id: validUser._id },
      process.env?.JWT_SECRET || "fff22-0ff"
    );

    const { password: pass, _id: theID, ...rest } = validUser.toObject();

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
    // .json("Session Pass Granted");
  } catch (error: any) {
    // Set status code to 500 and pass the error to the error handling middleware
    res.status(500);
    next(error);
  }
};
