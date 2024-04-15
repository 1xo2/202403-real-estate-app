import mongoose from "mongoose";
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";


// validate env
const validateEnvironmentVariables = () => {
  if (
    isNull_Undefined_emptyString(process.env.MONGOconn) ||
    typeof process.env.MONGOconn !== "string"
  ) {
    throw new Error("MONGOconn environment variable is missing or invalid");
  }

  if (
    isNull_Undefined_emptyString(process.env.DBname) ||
    typeof process.env.DBname !== "string"
  ) {
    throw new Error("DBname environment variable is missing or invalid");
  }
};
// db connection
const connectToDatabase = async () => {
  try {
    validateEnvironmentVariables();

    await mongoose.connect(process.env.MONGOconn as string, {
      dbName: process.env.DBname, // Specify the database name
    });
    console.log("Database connected successfully!");
    // console.log("DB conn OK!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

export { connectToDatabase };
