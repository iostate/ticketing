import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

jest.mock('../../nats-wrapper');

it('should return a 404 if the ticket is not found', async () => {
  const objectId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${objectId}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(404);
});

it('Should return a 200 if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Test Ticket',
      price: 100,
    });

  const ticketId = response.body.id;

  await request(app)
    .get(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(200);
});
