import { NextFunction, Request, Response } from 'express';
import xss from 'xss';
import errorHandler from '../errorHandling/errorHandler';
import { __SERVER_ERROR_UNAUTHORIZED } from '../../share/constants';
// import '../../typings/express.d.ts';

export function getBodyParams_XSS_sanitized_verifyUser(req: Request, res: Response, next: NextFunction){


    try {
        if (req?.params?.id) {
            const userParamID_sanitized = xss(req?.params?.id)
            if (userParamID_sanitized !== req.userTokenCookie) {
                next(errorHandler(__SERVER_ERROR_UNAUTHORIZED, 'n: sd-sfk-kl36', 401))
                // throw new Error('Unauthorized n: sd - sfk - kl36'); 
            }
        }
        if (req.params) {
            req.params = JSON.parse(xss(JSON.stringify(req.params)))
        }

        if (req.body) {
            req.body = JSON.parse(xss(JSON.stringify(req.body)))
        }
        next();


    } catch (error) {
        console.log('error:', error)
        next(error);
    }

    // if (req.body) {
    //     for (const key in req.body) {
    //         if (Object.prototype.hasOwnProperty.call(req.body, key)) {
    //             req.body[key] = xss(req.body[key]);
    //         }
    //     }
    // }

}