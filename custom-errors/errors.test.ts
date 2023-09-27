export abstract class CustomError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

class RequestValidation extends CustomError {
  statusCode = 401;
  constructor(message: string) {
    super(message);
  }
}

try {
  throw new RequestValidation('test');
} catch (e) {
  console.error(e);
}
