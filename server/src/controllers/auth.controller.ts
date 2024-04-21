import { ISanitizedUser, IUserResponse } from './../../typings/userTypes';
import { __SERVER_ACCESS_TOKEN } from './../share/constants';
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import xss from "xss";
import errorHandler from "../middleware/errorHandling/errorHandler";
import UserModel, { IUserDocument } from "../models/user.model";
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";





// Register
//////////
export const signup_controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Sanitize the req.body object using xss
  const sanitizedBody: string = xss(JSON.stringify(req.body));
  const { eMail, password, userName } = JSON.parse(sanitizedBody) as ISanitizedUser;


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

// LogIn
//////////
export const logIn_controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  //#region   SECURITY
  if (isNull_Undefined_emptyString(process.env?.JWT_SECRET)) {
    throw new Error('Internal Server Error, env missing')
    next()
  }
  // Sanitize the req.body object using xss
  const sanitizedBody: string = xss(JSON.stringify(req.body));
  const { eMail, password } = JSON.parse(sanitizedBody) as ISanitizedUser;

  try {
    if (
      isNull_Undefined_emptyString(password) ||
      isNull_Undefined_emptyString(eMail)
    ) {
      return next(errorHandler("request.body is not ok", "err:df0fpp", 500));
    }
    //#endregion


    const validUser = await UserModel.findOne({ eMail });

    //#region  VALIDATE USER
    if (!validUser)
      return next(errorHandler("User not found", "signIn-x", 500));

    const validPassword = bcrypt.compareSync(
      password,
      validUser.password as string
    );

    if (!validPassword)
      return next(errorHandler("Wrong Credentials", "signIn-d", 401));
    //#endregion


    const token = jwt.sign({ id: validUser._id.toString() }, process.env.JWT_SECRET);

    const { password: pass, _id: theID, ...rest } = validUser.toObject();


    res
      // httpOnly: cookie accessible from server ONLY - not react/client
      .cookie(__SERVER_ACCESS_TOKEN, token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error: any) {
    res.status(500);
    next(error);
  }
};

// google
//////////
export const google_controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  //#region   SECURITY
  if (isNull_Undefined_emptyString(process.env?.JWT_SECRET)) {
    throw new Error('Internal Server Error, env missing')
    next()
  }
  // Sanitize the req.body object using xss
  const sanitizedBody: string = xss(JSON.stringify(req.body));

  // Extract userName, eMail, and userPhoto from the sanitizedBody object
  const { eMail, userName } = JSON.parse(sanitizedBody) as ISanitizedUser;

  console.log("userName:", userName);
  console.log("eMail:", eMail);

  try {
    if (isNull_Undefined_emptyString(eMail)) {
      return next(errorHandler("request.body is not ok", "err:df0fpp", 500));
    }
    //#endregion
    
    
    const validUser = (await UserModel.findOne({ eMail })) as IUserDocument;

    if (validUser) {
      console.log("enter known user by google :");

      
     
      const token = jwt.sign({ id: validUser._id.toString() }, process.env.JWT_SECRET);

      console.log("validUser.toObject();:", validUser.toObject());

      // Extract only the necessary fields for the response
      const restResponseUser: IUserResponse = {
        userName: validUser.userName,
        eMail: validUser.eMail,
        createdAt: validUser.createdAt,
        updatedAt: validUser.updatedAt,
      };

      res
        // cookie info are accessible just from server - not react/client
        .cookie(__SERVER_ACCESS_TOKEN, token, { httpOnly: true })
        .status(200)
        .json(restResponseUser);
    } else {
      //  email not in DB ->
      //  create new user, generate password
      console.log("enter new user by google :");

      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatePassword, 10);
      const newUserName =
        (userName || "x-userName").replace(" ", "") + '_' +
        generatePassword.slice(-4);
      const newUser = new UserModel({
        userName: newUserName,
        eMail,
        password: hashedPassword,
      });
      await newUser.save();

    
      const token = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser.toObject();
      // cookie info are accessible just from server - not react/client
      res
        .cookie("accept_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error: any) {
    // Set status code to 500 and pass the error to the error handling middleware
    res.status(500);
    next(error);
  }
};
