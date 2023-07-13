export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    // used for logging purposes only,
    // does not supercede reason in subclasses using
    //   CustomError
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
