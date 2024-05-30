import { NextFunction, Request, Response } from "express";
import { wordsCap } from "../../utils/stringManipulation";
import { CustomError } from "./errorHandler"; // Import CustomError type from errorHandler


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
  const message = err.msg || "Internal Server Error.";

  // const isDuplicateKeyErr =
  //   err.message.includes("E11000") ||
  //   err.message.includes("duplicate key") ||
  //   err.name === "MongoServerError" ||
  //   (err && (err as any).code === 11000);

  // let resAltMsg; //= "An error occurred while processing your request.";
  // if (isDuplicateKeyErr) {
  //   resAltMsg = wordsCap("please try other user name");
  // }

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
    // message: resAltMsg || message,
    message: message,
    msg: err.msg,
    errorName: err?.name,
    error: err,
    // }

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
