import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUser } from '@sgtickets3/common';
import { errorHandler } from '@sgtickets3/common';
import { NotFoundError } from '@sgtickets3/common';

import { createTicketRouter } from './routes/new';
import { findTicketRouter } from './routes/show';
import { indexTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();

app.use(json());
app.set('trust proxy', true);

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // jest automatically sets this to test
  })
);

// user must be verified to access the following routers
app.use(currentUser);
// ROUTES
app.use(createTicketRouter);
app.use(findTicketRouter);
app.use(indexTicketsRouter);
app.use(updateTicketRouter);

// CATCH ALL ROUTE
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export { app };
