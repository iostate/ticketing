import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUser } from '@sgtickets3/common';
import { errorHandler } from '@sgtickets3/common';
import { NotFoundError } from '@sgtickets3/common';

import { createChargeRouter } from './routes/new';
const app = express();

app.use(json());
app.set('trust proxy', true);

// test structured clone in node
// Create an object with a value and a circular reference to itself.
// interface cloneType {
//   name: string;
//   itself?: any;
// }
// const original: cloneType = { name: 'MDN' };
// original.itself = original;

// Clone it
// const clone = structuredClone(original);

// console.assert(clone !== original); // the objects are not the same (not same identity)
// console.assert(clone.name === 'MDN'); // they do have the same values
// console.assert(clone.itself === clone); // and the circular reference is preserved

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // jest automatically sets this to test
  })
);

// user must be verified to access the following routers
app.use(currentUser);
// ROUTES
app.use(createChargeRouter);

// CATCH ALL ROUTE
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export { app };
