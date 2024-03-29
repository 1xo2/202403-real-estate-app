import { Request, Response, NextFunction } from "express";
import { wordsCap } from "../../utils/stringManipulation";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  console.error(err);

  // const statusCode = res.statusCode || 500;
  // Get the status code from the error object if available
  const statusCode =
    err instanceof Error && (err as any).statusCode
      ? (err as any).statusCode
      : res.statusCode || 500;

  const message = err.message || "Internal Server Error.";

  const isDuplicateKeyErr =
    err.message.includes("E11000") ||
    err.message.includes("duplicate key") ||
    err.name === "MongoServerError" ||
    (err && (err as any).code === 11000);

  let resMsg = "An error occurred while processing your request.";
  if (isDuplicateKeyErr) {
    resMsg = wordsCap("please try other user name");
  }

  // Logging to STDOUT/STDERR: Platform-as-a-Service (PaaS)
  console.error({
    success: false,
    statusCode,
    message,
    errorName: err?.name,
    error: err,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: resMsg,
    //   errorName: err?.name,
    //   error: err,
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
