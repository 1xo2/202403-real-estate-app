import compression from "compression";
import cookieParser from "cookie-parser";
import express, {
  Application
} from "express";
import { connectToDatabase } from "../src/middleware/db";
import errorMiddleware from "../src/middleware/errorHandling/errorMiddleware";
import authRouter from "../src/routes/auth.route";
import listingRouter from "../src/routes/listing.route";
import publicRouter from "../src/routes/public/public.route";
import userRouter from "../src/routes/user.route";
import envManager, { validateEnvironmentVariables } from "./middleware/envManager";
import helmetConfig from "./middleware/security/helmetConfig";
import { getBodyParams_XSS_sanitized_verifyUser } from "./middleware/security/sanitize";

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
app.use(helmetConfig());    // Content-Security-Policy header.
app.use(compression());     // Use compression middleware
app.use(cookieParser())     // verify user by cookie token.
app.use(express.json());
app.use(getBodyParams_XSS_sanitized_verifyUser);    // Add middleware before route handlers



///////////////
// ROUTS
///////////////
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/public",publicRouter);

app.use(errorMiddleware);   // Error handling middleware




const port = envManager.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

