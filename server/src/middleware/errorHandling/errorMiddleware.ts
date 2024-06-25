import { NextFunction, Request, Response } from "express";
import { wordsCap } from "../../utils/stringManipulation";
import { CustomError } from "./errorHandler"; // Import CustomError type from errorHandler
import mongoose from "mongoose";


const errorMiddleware = (
  // err: Error,
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  console.error(err);
  console.error(err.stack);

  // Get the status code from the error object if available
  const statusCode = err.statusCode || res.statusCode || 500;
  let message = err.msg || "An unexpected error occurred. Please try again later.";;

  const isMongoServerError =
    err.message.includes("E11000") ||
    err.message.includes("duplicate key") ||
    err.name === "MongoServerError" ||
    (err && (err as any).code === 11000);


  if (isMongoServerError) {
    // new updated code: Extract the duplicate field from keyPattern
    const duplicateField = Object.keys((err as any).keyPattern || {})[0];
    message = wordsCap(`The ${duplicateField} is already in use. Please try another.`);
  }

  // Handle MongoDB validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    message = "Validation error: ";
    for (let field in err.errors) {
      message += `${field}: ${err.errors[field].message} `;
    }
  }

  // Handle other MongoDB errors
  else if (err.name === 'MongoNetworkError') {
    message = "A network error occurred while communicating with the database. Please try again later.";
  } else if (err.name === 'MongoTimeoutError') {
    message = "The database operation timed out. Please try again later.";
  } else if (err.name === 'MongoParseError') {
    message = "There was an error parsing the data. Please check the data format.";
  }


  // Logging to STDOUT/STDERR: Platform-as-a-Service (PaaS)
  console.error({
    success: false,
    statusCode,
    message,
    errorName: err?.name,
    error: err,
  });

  // Respond to client with error details
  res.status(statusCode || 500).json({
    // error: {
    success: false,
    statusCode,
    message,
    // message: message,
    msg: err?.msg,
    errorName: err?.name,
    error: err,
    // Only include the stack trace in development mode for security reasons
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })

  });

  //   res.status(statusCode).json({
  //     success: false,
  //     statusCode,
  //     message,
  //     errorName: err?.name,
  //     error: err,
  //   });
};

export default errorMiddleware;
