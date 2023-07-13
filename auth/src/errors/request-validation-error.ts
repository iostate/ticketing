import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

// interface CustomError {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }
export class RequestValidationError extends CustomError {
  reason: String;
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super('invalid credentials (email and password)');
    this.errors = errors;

    this.reason = errors[0]['msg'];

    // Required when extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type == 'field') {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg };
      // else {
      //   return { message: error.msg, field: '' };
      // }
      // return { message: error.msg, field: error.path };
    });
  }
}
