import dotenv from "dotenv";
import express, {
  Application
} from "express";
import { connectToDatabase } from "./src/middleware/db";
import errorMiddleware from "./src/middleware/errorHandling/errorMiddleware";
import authRouter from "./src/routes/auth.route";
import userRouter from "./src/routes/user.route";


//For env File
dotenv.config();

// Connect to the database
connectToDatabase()

const app: Application = express();
app.use(express.json());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error handling middleware
app.use(errorMiddleware);

