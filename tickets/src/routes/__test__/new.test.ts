import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send();
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is logged in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
  // expect(response.status).toEqual(401);
});

it('can be accessed if the user is signed in', async () => {
  const cookie = global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it('returns an error if an invalid price is provided', async () => {
  // give invalid price
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Mana',
      price: -10,
    })
    .expect(400);

  // leave price empty
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Mana',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Ticket Test',
      price: 10,
    })
    .expect(201);
});

it('returns a list of all tickets created', async () => {
  const ticket1 = 'TIcket test';
  const price1 = 10;
  const ticket2 = '2222';
  const price2 = 2222;
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: ticket1,
    price: price1,
  });
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: ticket2,
    price: price2,
  });
  const response = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  const tickets = await Ticket.find();

  expect(tickets.length).toEqual(2);
  expect(tickets[0].title).toEqual(ticket1);
  expect(tickets[0].price).toEqual(price1);
  expect(tickets[1].title).toEqual(ticket2);
  expect(tickets[1].price).toEqual(price2);
});

it('publishes an event', async () => {
  const ticket = {
    title: 'ticket',
    price: 3001,
  };

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send(ticket);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
