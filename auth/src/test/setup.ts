import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
// runs before all tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {});
});

// runs before every test
beforeEach(async () => {
  process.env.JWT_KEY = 'asdfasdf';
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

global.signin = async () => {
  const email = 'qmtruong92@gmail.com';
  const password = 'test123';

  const response = await request(app).post('/api/users/signup').send({ email, password });
  const cookie = response.get('Set-Cookie');
  return cookie;
};
