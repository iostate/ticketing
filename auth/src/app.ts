// this file is for running this service locally
// grabs the secrets from disk
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
// import https from 'https';
// import http from 'http';
// import fs from 'fs';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { testTicketRouter } from './routes/test-router';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { createTicketRouter } from './routes/add-ticket';

// ASYNC FILE READ
// async function getKeyAndCertificate() {
//   try {
//     const key = await fs.readFile('../../localhost-key.pem');
//     const certificate = await fs.readFile('../../localhost.pem');
//     return { key, certificate };
//   } catch (err) {
//     console.log(err);
//   }
// }
// getKeyAndCertificate().then((data) => console.log(data));

// HTTPS CERTIFICATES AND KEYS
// const httpsKey = fs.readFileSync('../../key.pem', 'utf-8');
// const httpsCertificate = fs.readFileSync('../../server.crt', 'utf-8');
// const keyAndCertificate = { key: httpsKey, cert: httpsCertificate };

const app = express();

app.use(json());
app.set('trust proxy', true);

app.use(
  cookieSession({
    signed: false,
    keys: ['key1', 'key2'],
    // credentials: true
    secure: process.env.NODE_ENV !== 'test', // jest automatically sets this to test
  })
);
// ROUTES
app.use(createTicketRouter);
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
