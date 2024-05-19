// express.d.ts

// declare global {
//     namespace Express {
//         interface Request {
//             userID?: any; // Define the user property
//         }
//     }
// }
// custom.d.ts

// declare namespace Express {
//     interface Request {
//         userTokenCookie?: string; // Define the user property
//     }
// }
import { Request, Response, NextFunction } from 'express';
import { IUserFields } from '../src/models/user.model';

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: IUserFields; 
            userTokenCookie?: string; // Define the user property
        }
    }
}
