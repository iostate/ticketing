import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Something went wrong', err);

  if (err instanceof RequestValidationError) {
    // const formattedErrors = err.errors.map((error) => {
    //   if (error.type === 'field') {
    //     return { message: error.msg, field: error.path };
    //   }
    // });
    res.status(err.statusCode).send(
      // follows the structure of how our errors should look like
      {
        errors: err.serializeErrors(),
      }
    );
  }
  // console.log('error 1');
  if (err instanceof DatabaseConnectionError) {
    res.status(err.statusCode).send({
      errors: [{ messages: err.serializeErrors() }],
    });
  }

  // res.status(400).send({
  //   errors: [{ message: 'something went wrong' }],
  // });
};
