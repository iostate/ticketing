import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
// Attach the polyfill as a Global function
import structuredClone from '@ungap/structured-clone';

declare global {
  var signin: (id?: string) => string[];
  // var structuredClone: any;
}

// declare global {
//   var structuredClone: <T>(any: T, options?: { lossy?: boolean }) | typeof structuredClone;
// }
// if (!("structuredClone" in globalThis)) {
//   globalThis.structuredClone = structuredClone;
//   console.log('e');
// }
// };
// }

// global.structuredClone = jest.fn((val) => {
//   return JSON.parse(JSON.stringify(val));
// });

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51ON3z8KSF9LQbi9FcxGNEHB6MwykO1suvUSLMahq8d2KnuusBUZH3WAsRDdWViin9jpiRC3TYhXleK1YTJIYrAMN00Y3bQOBB9';

let mongo: any;
// runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {});
});

// runs before every test
beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Needs to ultimately set a currentUser property on the request
  // Create payload
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'valid@email.com',
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };
  // Turn that session into JSON
  const jsonSession = JSON.stringify(session);

  // Decode into base 64
  const base64 = Buffer.from(jsonSession).toString('base64');

  return [`express:sess=${base64}`];
};
