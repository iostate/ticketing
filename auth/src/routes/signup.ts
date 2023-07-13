import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email field is not an email'),
    body('password').trim().isLength({ min: 4, max: 20 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    // email or password was invalid
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // const { email, password } = req.body;
    // console.log('Creating a user...');
    // simulate database connection error
    throw new DatabaseConnectionError();

    // res.send('working');
  }
);

export { router as signUpRouter };
