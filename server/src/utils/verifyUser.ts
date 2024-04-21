
import jwt, { VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { __SERVER_ACCESS_TOKEN } from '../share/constants';
import errorHandler from '../middleware/errorHandling/errorHandler'
import { isNull_Undefined_emptyString } from "./stringManipulation";


export const verifyUser_byCookie = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.cookies[__SERVER_ACCESS_TOKEN]
    if (isNull_Undefined_emptyString(token)) return next(errorHandler('unAuthorized: no access token', 'unAuthorized', 401))

    jwt.verify(token, process.env.JWT_SECRET || '', (err: VerifyErrors | null, userTokenCookie:any) => {
        
        if (err) return next(errorHandler(err?.message || 'forbidden', err?.name, 403))
        req.userTokenCookie = userTokenCookie.id
        next();
    })
}
