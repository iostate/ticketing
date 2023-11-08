import request from 'supertest';

import { app } from '../../app';

it('Should return all orders for a user with code 200', async () => {
  const user1 = global.signin();
  const user2 = global.signin(); // should not see orders for this user

  // User #1 tickets
  const ticket1 = await global.buildTicket();
  const ticket2 = await global.buildTicket();

  const ticket3 = await global.buildTicket();

  // Simulate orders for User #1
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id });

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket2.id });

  // sim orders for user #2
  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id });

  // Get all orders for User #1
  const ordersForThisUser = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .send();

  expect(ordersForThisUser.body[0].ticket.id).toEqual(ticket1.id);
  expect(ordersForThisUser.body[1].ticket.id).toEqual(ticket2.id);
  expect(ordersForThisUser.body[0].userId).toEqual(order1.userId);
  expect(ordersForThisUser.body[1].userId).toEqual(order1.userId);

  // const ordersUser = Object.values(ordersForThisUser.body);
  // for (let order in ordersUser) {

  // }
});

// const createTicket = async () => {
//   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
//     title: 'test ticket',
//     price: 2222,
//   });
// };

// it('should get a list of all tickets', async () => {
//   await createTicket();
//   await createTicket();
//   await createTicket();
//   const response = await request(app)
//     .get('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({});
//   // console.log(response.body);
// });
