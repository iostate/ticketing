import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import { TicketDoc, Ticket } from '../models/ticket';

declare global {
  var signin: () => string[];
  var buildTicket: () => Promise<TicketDoc>;
}

global.buildTicket = async function (): Promise<TicketDoc> {
  /**
   * Builds a Ticket Document and saves it to the database.
   *
   * @returns TicketDoc A Ticket Document.
   */
  // const buildTicket = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();
  return ticket;
};

global.signin = () => {
  // Needs to ultimately set a currentUser property on the request
  // Create payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
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
// }

jest.mock('../nats-wrapper');

let mongo: any;
// runs before all tests
beforeAll(async () => {
  jest.clearAllMocks();
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {});
});

// runs before every test
beforeEach(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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
