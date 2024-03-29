class CustomError extends Error {
  statusCode: number;

  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export default function errorHandler(
  message: string,
  name: string,
  statusCode: number = 500
): CustomError {
  const err = new CustomError(
    `Status Code: ${statusCode}, Message: ${message}`,
    name,
    statusCode
  );
  return err;
}
