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
import { sanitized_verifyUser } from "./middleware/security/sanitize";
import path from "path";

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
app.use(express.json());
app.use(cookieParser())     // verify user by cookie token.
// app.use(getBodyParams_XSS_sanitized_verifyUser);    // Add middleware before route handlers
app.use(sanitized_verifyUser);    // Add middleware before route handlers




///////////////
// ROUTS
///////////////
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
// PUBLIC ROUTES
app.use("/api/public",publicRouter);

app.use(errorMiddleware);   // Error handling middleware


console.log('__dirname:', __dirname)
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});





const port = envManager.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

