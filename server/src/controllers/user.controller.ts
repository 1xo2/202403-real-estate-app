
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";
import { ISanitizedUser, IUserResponse } from './../../typings/userTypes';
import errorHandler from "../middleware/errorHandling/errorHandler";
import xss from "xss";
import UserModel from '../models/user.model';
import { __SERVER_ACCESS_TOKEN } from '../share/constants';

export const test = (req: Request, res: Response) => {
  res.json({
    message: "hello from user.",
  });
};
export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //#region -- SECURITY.
    const userParamID_sanitized = xss(req?.params?.id)
    if (req.userTokenCookie !== userParamID_sanitized) return next(errorHandler('Unauthenticated account owner update request', '', 401))
    // Sanitize the req.body object using xss
    const body_sanitized: string = xss(JSON.stringify(req.body));
    // sanitizedBody object
    const user: IUserResponse = JSON.parse(body_sanitized) as ISanitizedUser;
    //#endregion


    //#region --  DATA UPDATE
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userParamID_sanitized, {
      $set: { // set: if new value
        userName: user.userName,
        eMail: user.eMail,
        password: user.password,
      },
    }, { new: true }
    );

    if (!updateUser) {
      return next(errorHandler("User not found", "", 404));
    }

    const { password, ...rest } = updateUser?.toObject()

    //#endregion

    res.status(200).json(rest);

  } catch (error) {
    next(error)
  }

};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //#region -- SECURITY.
    const userParamID_sanitized = xss(req?.params?.id)
    if (userParamID_sanitized !== req.userTokenCookie) return next(errorHandler('Unauthenticated account owner request', 'n: sdsfkkl2', 401))
        
    //#endregion

    await UserModel.findByIdAndDelete(userParamID_sanitized)
    res.clearCookie('access_token');
    res.clearCookie(__SERVER_ACCESS_TOKEN);
    res.status(200).json("User deleted successfully");


  } catch (error) {
    console.error('error:', error)
    next(error)
  }
}