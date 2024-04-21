// express.d.ts

// declare global {
//     namespace Express {
//         interface Request {
//             userID?: any; // Define the user property
//         }
//     }
// }
// custom.d.ts

declare namespace Express {
    interface Request {
        userTokenCookie?: string; // Define the user property
    }
}
