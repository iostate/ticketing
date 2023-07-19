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
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

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
    name: 'express',
    signed: false,
    keys: ['key1', 'key2'],
    // credentials: true
    secure: true,
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

// const server = https.createServer(keyAndCertificate, app);
const start = async () => {
  if (!process.env.JWT_KEY) {
    console.log(process.env.JWT_KEY);
    throw new Error('JWT_KEY must be defined');
  }
  console.log(process.env.JWT_KEY);
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');

    // await mongoose.connect(
    //   'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.0'
    // );
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
