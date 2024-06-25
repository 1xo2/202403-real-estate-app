
import { isNull_Undefined_emptyString } from '../utils/stringManipulation';

// Conditionally load dotenv -> not for production.
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

// Load environment variables from .env file





// Validate required environment variables
export function validateEnvironmentVariables() {
    ['MONGOconn', 'DBname', 'PORT', 'JWT_SECRET', 'ORIGIN'].forEach((val: string) => {
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
    ORIGIN: process.env.ORIGIN as string
};

export default envManager;