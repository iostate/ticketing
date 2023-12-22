import request from 'supertest';
import { app } from '../../app';

it('should clear the cookie upon signout', async () => {
  const cookie = await global.signin();
  //   await request(app)
  //     .post('/api/users/signup')
  //     .send({
  //       email: 'test@123.com',
  //       password: 'test123',
  //     })
  //     .expect(201);

  // await request(app).post('/api/users/signin').send({
  //     email: "test@123.com",
  //     password: "test123"
  // }).expect(200);

  const response = await request(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  console.log(response.get('Set-Cookie'));
  expect(response.get('Set-Cookie')).toEqual([
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  ]);
});
