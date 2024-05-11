import dotenv from 'dotenv';
import { isNull_Undefined_emptyString } from '../utils/stringManipulation';

// Load environment variables from .env file
dotenv.config();




// Validate required environment variables
export function validateEnvironmentVariables() {
    ['MONGOconn', 'DBName', 'PORT', 'JWT_SECRET'].forEach((val: string) => {
        if (isNull_Undefined_emptyString(process.env[val] as string)) {
            throw new Error(`${val} \n ----environment variable is missing or invalid`);
        }
    });
};

// Expose configuration settings
const envManager = {
    mongoConn: process.env.MONGOconn as string,
    DBName: process.env.DBname as string,
    PORT: process.env.PORT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
};

export default envManager;