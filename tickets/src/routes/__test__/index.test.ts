import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'test ticket',
    price: 2222,
  });
};

it('should get a list of all tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  // console.log(response.body);
});
