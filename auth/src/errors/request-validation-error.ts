import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      console.log(err);
      if (err.type === 'field') {
        console.log(err.msg);
        console.log(err.path);
        return { message: err.msg, field: err.path };
      }
      console.log(err.msg);
      return { message: err.msg };
    });
  }
}
