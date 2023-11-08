import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUser } from '@sgtickets3/common';
import { errorHandler } from '@sgtickets3/common';
import { NotFoundError } from '@sgtickets3/common';

import { deleteOrderRouter } from './routes/delete';
import { getOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';

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
app.use(deleteOrderRouter); // /api/orders/:id
app.use(getOrderRouter); // /api/orders/:id
app.use(newOrderRouter); // /api/orders
app.use(indexOrderRouter); // /api/orders

// CATCH ALL ROUTE
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export { app };
