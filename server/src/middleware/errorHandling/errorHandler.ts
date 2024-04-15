interface ICustomErrorProps {
  name: string;
  statusCode: number;
  // message: string;
  msg: string;
}

export class CustomError extends Error implements ICustomErrorProps {
  name: string;
  statusCode: number;
  // message: string;
  msg: string;
  constructor(message: string, name: string, statusCode: number) {
    super(`Message: ${message}, Status Code: ${statusCode}, Error Name: ${name}`);
    this.name = name;
    this.statusCode = statusCode;
    // this.message = message; // the supper overWrite the message
    this.msg = message;
  }
}

export default function errorHandler(
  message: string,
  name: string = "Unknown Error",
  statusCode: number = 500
): CustomError {
  const err = new CustomError(
    message,
    name,
    statusCode
  );
  return err;
}

// export  function errorHandler2({
//   message,
//   name,
//   statusCode = 500,
// }: {
//   message: string;
//   name: string;
//   statusCode?: number;
// }): CustomError {
//   const err = new CustomError(message, name, statusCode);
//   return err;
// }