import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

import { natsWrapper } from '../../nats-wrapper';

// NotFoundError - 404
it('Should return a 404 if ticket is not found', async () => {
  // create ticket
  const ticketId = new mongoose.Types.ObjectId();

  const cookie = global.signin();
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId });

  expect(response.status).toBe(404);
});
// BadRequestError - 400
// Create a ticket with reserved status on it
it('Should return a 400 if ticket is already reserved', async () => {
  const cookie = global.signin();
  // Create Ticket with Reserved status
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
  });
  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getTime() + 15 * 3);

  const order = Order.build({
    userId: 'testing123',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

// Success
it('should return a 200 code if the ticket has successfully been created', async () => {
  // cookie
  const cookie = global.signin();

  // doesn't have ticket, expiration date
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create order through API
  // ticket must already be created
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id });

  // Document was successfully created
  expect(response.status).toBe(201);

  // Check if the order was successfully saved to the database

  // Approach #1
  // Reason: Seems MongoMemoryServer is not capable of pulling it out of the database?
  const orderId = response.body.id;
  const order = await Order.findById(orderId);
  // console.log(order);
  // console.log(orderId);

  // Approach #2
  // Count the documents inside the collection.
  // Should be 1 document inside the collection
  const documentCount = await Order.countDocuments({ _id: orderId });
  expect(documentCount).toEqual(1);
});

it.todo('emits an order created event');

// it('has a route handler listening to /api/orders for post requests', async () => {
//   const response = await request(app).post('/api/orders').send();
//   expect(response.status).not.toEqual(404);
// });

// it('emits a 404 if the ticket is not found', async () => {
//   // Simulate signin by adding a cookie on the request
//   const signInCookie = global.signin();

//   const reqBody = {
//     ticketId: '653c2b02dd18c0d53a5150ea',
//   };

//   const response = await request(app)
//     .post('/api/orders')
//     .set('Cookie', signInCookie)
//     .send(reqBody)
//     .expect(404);

//   // expect(response.body.ticketId == '653c2b02dd18c0d53a5150ea');
// });

// it('Create the ticket and find it', async () => {
//   const signInCookie = global.signin();

//   const reqBody = {
//     ticketId: '653c2b02dd18c0d53a5150ea',
//   };

//   // Create the Ticket
//   const ticket = await Ticket.build({
//     title: 'Testing this in orders-service',
//     price: 2100,
//     userId: 'jsadjasd',
//   });

//   await ticket.save();

//   const { id } = ticket;

//   const response = await request(app)
//     .post('/api/orders')
//     .set('Cookie', signInCookie)
//     .send({ ticketId: id })
//     .expect(200);

//   console.log(response.body);

// console.log(response.body.id === '653c2b02dd18c0d53a5150ea');
// });

// it('can be accessed if the user is signed in', async () => {
//   const cookie = global.signin();
//   const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({});

//   expect(response.status).not.toEqual(401);
// });

// it('returns an error if an invalid title is provided', async () => {
//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: '',
//       price: 10,
//     });

//   expect(response.status).toEqual(400);
// });

// it('returns an error if an invalid price is provided', async () => {
//   // give invalid price
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'Mana',
//       price: -10,
//     })
//     .expect(400);

//   // leave price empty
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'Mana',
//     })
//     .expect(400);
// });

// it('creates a ticket with valid inputs', async () => {
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'Ticket Test',
//       price: 10,
//     })
//     .expect(201);
// });

// it('returns a list of all tickets created', async () => {
//   const ticket1 = 'TIcket test';
//   const price1 = 10;
//   const ticket2 = '2222';
//   const price2 = 2222;
//   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
//     title: ticket1,
//     price: price1,
//   });
//   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
//     title: ticket2,
//     price: price2,
//   });
//   const response = await request(app)
//     .get('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({});

//   const tickets = await Ticket.find();

//   expect(tickets.length).toEqual(2);
//   expect(tickets[0].title).toEqual(ticket1);
//   expect(tickets[0].price).toEqual(price1);
//   expect(tickets[1].title).toEqual(ticket2);
//   expect(tickets[1].price).toEqual(price2);
// });

// it('publishes an event', async () => {
//   const ticket = {
//     title: 'ticket',
//     price: 3001,
//   };

//   await request(app).post('/api/tickets').set('Cookie', global.signin()).send(ticket);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
