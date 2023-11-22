import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';
import mongoose from 'mongoose';

/**
 * Builds a Ticket Document and saves it to the database.
 *
 * @returns TicketDoc A Ticket Document.
 */
const buildTicket = async (): Promise<TicketDoc> => {
  const ticket = await global.buildTicket();
  return ticket;
};

/**
 * Builds an order and saves it to the database.
 * @param username Username that will be saved on the database.
 * @param ticket TicketDoc
 */
const buildOrder = async (username: string, ticket: TicketDoc) => {
  const order = Order.build({
    userId: username,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
};

it('Should return a 401 if the User is NOT Logged in', async () => {
  // NOTE: Do not set the cookie before making the request
  const response = await request(app).get('/api/orders').send({}).expect(401);
});

// Success
it('fetches particular user order with 200 status code', async () => {
  const userOne = global.signin();
  const userTwo = global.signin();

  const ticket = await buildTicket();

  // Create 2 orders  as User #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Retrieve a particular user order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(orderOne.id);
});

it('should return a 401 if user is not allowed to see a post', async () => {
  // User One
  const userOne = global.signin();

  // create order under different user
  const differentUser = global.signin();
  const { id: ticketOneId } = await global.buildTicket();
  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', differentUser)
    .send({ ticketId: ticketOneId });

  // access order using userOne
  const fetchedOrder = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', userOne)
    .send();

  expect(fetchedOrder.status).toEqual(401);
});

it('should return a 404 if the order is not found', async () => {
  const user = global.signin();
  const nonExistingTicket = new mongoose.Types.ObjectId();

  const order = await request(app)
    .get(`/api/orders/${nonExistingTicket}`)
    .set('Cookie', user)
    .send();
  expect(order.status).toEqual(404);
});

// it('should return a 404 if the ticket is not found', async () => {
//   const objectId = new mongoose.Types.ObjectId().toHexString();
//   await request(app)
//     .get(`/api/tickets/${objectId}`)
//     .set('Cookie', global.signin())
//     .send({})
//     .expect(404);
// });

// it('Should return a 200 if the ticket is found', async () => {
//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'Test Ticket',
//       price: 100,
//     });

//   const ticketId = response.body.id;

//   await request(app)
//     .get(`/api/tickets/${ticketId}`)
//     .set('Cookie', global.signin())
//     .send({})
//     .expect(200);
// });
