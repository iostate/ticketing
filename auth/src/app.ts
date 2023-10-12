import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

// Routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { testTicketRouter } from './routes/test-router';
import { errorHandler } from '@sgtickets3/common';
import { NotFoundError } from '@sgtickets3/common';

const app = express();

app.use(json());
app.set('trust proxy', true);

app.use(
  cookieSession({
    signed: false,
    // jest sets to test automatically
    secure: process.env.NODE_ENV !== 'test',
  })
);
// ROUTES
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// CATCH ALL ROUTE
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export { app };
