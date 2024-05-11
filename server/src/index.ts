import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, {
  Application
} from "express";
import { connectToDatabase } from "../src/middleware/db";
import errorMiddleware from "../src/middleware/errorHandling/errorMiddleware";
import authRouter from "../src/routes/auth.route";
import listingRouter from "../src/routes/listing.route";
import userRouter from "../src/routes/user.route";
import { getBodyParams_XSS_sanitized_verifyUser } from "./middleware/security/sanitize";
import compression from "compression";
import helmetConfig from "./middleware/security/helmetConfig";
import envManager, { validateEnvironmentVariables } from "./middleware/envManager";

///////////////
// INI
///////////////
// dotenv.config();      //For env File
validateEnvironmentVariables()
const app: Application = express();
connectToDatabase()   // Connect to the database


///////////////
// MIDDLEWARE
///////////////
app.use(express.json());
app.use(cookieParser())     // verify user by cookie token.
app.use(compression());     // Use compression middleware
app.use(errorMiddleware);   // Error handling middleware
app.use(getBodyParams_XSS_sanitized_verifyUser);    // Add middleware before route handlers
app.use(helmetConfig());    // Content-Security-Policy header.




const port = envManager.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});


///////////////
// ROUTS
///////////////
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);




