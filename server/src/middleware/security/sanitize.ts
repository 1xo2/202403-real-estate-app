import { NextFunction, Request, Response } from 'express';
import xss from 'xss';
import errorHandler, { CustomError } from '../errorHandling/errorHandler';
import { __SERVER_ERROR_UNAUTHORIZED } from '../../share/constants';
import { verifyUser_byCookie } from '../../utils/verifyUser';
// import '../../typings/express.d.ts';

export function sanitized_verifyUser(req: Request, res: Response, next: NextFunction) {
    // if (req.params) {
    //     req.params = JSON.parse(xss(JSON.stringify(req.params)))
    // }
    // if (req.body) {
    //     req.body = JSON.parse(xss(JSON.stringify(req.body)))
    // }


    try {

        // console.log('+1+Sanitize Middleware: Before sanitation: req.params:', req.params);
        // console.log('+1+Sanitize Middleware: Before sanitation: req.body:', req.body);

        // Sanitize request parameters
        if (req.params) {
            req.params = JSON.parse(xss(JSON.stringify(req.params)))
            // for (const key in req.params) {
            //     if (Object.prototype.hasOwnProperty.call(req.params, key)) {
            //         req.params[key] = JSON.parse(xss(req.params[key]) || '');
            //     }
            // }
        }

        // Sanitize request body
        if (req.body) {
            req.body = JSON.parse(xss(JSON.stringify(req.body)))
            // for (const key in req.body) {
            //     if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            //         req.body[key] = JSON.parse(xss(req.body[key]) || '');
            //     }
            // }

        }

        // console.log('+2+Sanitize Middleware: After sanitation: req.params:', req.params);
        // console.log('+2+Sanitize Middleware: After sanitation: req.body:', req.body);
        // Verify user authentication/authorization for private routes
        // if (!isPublicRoute(req)) {

        //     console.log('+3+User authentication check in Sanitize Middleware');
        //     console.log('+3+req.user:', req.user);
        //     console.log('+3+req.params.id:', req.params.id);

        //     if (!req.user) {
        //         return next(errorHandler(__SERVER_ERROR_UNAUTHORIZED, 'User is not authorized. n:asdf7kh24%u', 401));
        //     }

        //     verifyUser_byCookie(req, res, (err?: any) => {
        //         if (err) {
        //             return next(errorHandler(__SERVER_ERROR_UNAUTHORIZED, 'User is not authorized. n:as61dfd7kh24%u', 401));
        //         }
        //     })

        //     if (req?.params?.id) {
        //         const userParamID_sanitized = JSON.parse(xss(req.params.id) || '');
        //         if (userParamID_sanitized !== req.userTokenCookie) {
        //             return next(new CustomError(__SERVER_ERROR_UNAUTHORIZED, 'Unauthorized: token mismatch. n: sd-sfk-kl36', 401));
        //         }
        //     }

        // }

        next();

    } catch (error) {
        console.error('Error in middleware:', error);

        // Check if error is an instance of Error
        if (error instanceof Error) {
            next(new CustomError('Internal Server Error', error.message, 500));
        } else {
            next(new CustomError('Internal Server Error', 'N:aa9lk;9s9je22a', 500));
        }
    }
}

// function isPublicRoute(req: Request): boolean {

//     const publicRoutes = [
//         '/api/auth/login',
//         '/api/auth/google',
//         '/api/public/search',
//         '/api/publicRoute',
//     ];

//     return publicRoutes.includes(req.path);
// }