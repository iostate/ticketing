import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';
it('should return a 404 if the provided id does not exist', async () => {
  // Create a ticket with an ID that does not exist
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Update title',
      price: 999,
    })
    .expect(404);
});

it('should return a 401 Error if the user is not authenticated', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/$${ticketId}`)
    .send({
      title: 'Ticket Test',
      price: 300,
    })
    .expect(401);
});

it('should return a 400 if the ticket is reserved', async () => {
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .send({
      title: 'Ticket Test',
      price: 300,
    })
    .set('Cookie', cookie)
    .expect(201);

  console.log(response.body.id);

  // find ticket
  const ticket = await Ticket.findById(response.body.id);

  // set orderId on ticket
  ticket!.set({ orderId: 'asdf' });

  // save ticket
  await ticket!.save();
  // make put request on ticket, expect 400
  await request(app)
    .put(`/api/tickets/${ticket!.id}`)
    .set('Cookie', cookie)
    .send({
      price: 301010,
    })
    .expect(400);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // create ticket
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.signin())
    .send({
      title: 'my ticket',
      price: 3000,
    })
    .set('Cookie', global.signin());

  const ticketId = response.body.id;
  // console.log(`Attempting to update ticketId = ${response.body.id}`);
  // console.log(`response.body.id = ${response.body.id}`);

  // update new ticket
  const updatedTicket = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({ title: 'update ticket', price: 3001 })
    .expect(401);

  // await request(app).put(`/api/tickets/`)
});

it('should return a 400 if the user provides an invalid title or price', async () => {
  // Store reference to user
  const userCookie = global.signin();

  const ticket1 = await request(app).post(`/api/tickets`).set('Cookie', userCookie).send({
    title: 'test ticket',
    price: 100,
  });

  // Create first ticket
  const updateTicket = await request(app)
    .put('/api/tickets/' + ticket1.body.id)
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 300,
    })
    .expect(400);

  const updateTicket2 = await request(app)
    .put('/api/tickets/' + ticket1.body.id)
    .set('Cookie', global.signin())
    .send({
      title: 'testing',
      price: -10,
    });
});

it('updates the ticket if valid inputs are provided', async () => {
  const userCookie = global.signin();

  const ticket1 = await request(app).post(`/api/tickets`).set('Cookie', userCookie).send({
    title: 'test ticket',
    price: 100,
  });

  const updateTicket = await request(app)
    .put(`/api/tickets/${ticket1.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: 'updated ticket',
      price: 3000,
    });

  console.log(updateTicket.body);

  expect(updateTicket.body.title).toEqual('updated ticket');
  expect(updateTicket.body.price).toEqual(3000);
});

it('publishes an event', async () => {
  const userCookie = global.signin();

  const ticket1 = await request(app).post(`/api/tickets`).set('Cookie', userCookie).send({
    title: 'test ticket',
    price: 100,
  });

  const updateTicket = await request(app)
    .put(`/api/tickets/${ticket1.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: 'updated ticket',
      price: 3000,
    });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// it('should return a 404 error if the price is not valid', async () => {
//   await request(app)
//     .put(`/api/tickets/${validTicketId}`)
//     .set('Cookie', global.signin())
//     .send({
//       title: 'Test ticket',
//       price: -300,
//     })
//     .expect(404);
// });

// it('should return a 200 if the ticket is successfully updated', async () => {
//   // create ticket
//   await request(app);
// });
