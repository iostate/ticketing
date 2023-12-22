import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // first set a variable to the cookie
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'q@app.com',
      password: 'test123',
    })
    .expect(400);

  const cookie = response.get('Set-Cookie');

  // set the request to have the cookie obtained
  const details = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(details.body).toBeDefined();
});
