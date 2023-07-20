import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful sign up', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'a1@a1.com',
      password: 'testpassword',
    })
    .expect(201);
});

it('returns a 400 error when entering invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asasa.com',
      password: 'testpassword',
    })
    .expect(400);
});

it('returns a 400 error when entering invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asasa.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 error when missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: '',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'qmtruong92@gmail.com',
      password: 'testpassword',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'qmtruong92@gmail.com',
      password: 'testpassword',
    })
    .expect(400);
});

it('should set a cookie upon successful signup', async () => {
  const response = await request(app).post('/api/users/signup').send({
    email: 'qmtruong92@gmail.com',
    password: 'testpassword',
  });
  const cookies = response.headers['Set-Cookie'];
  expect(response.get('Set-Cookie')).toBeDefined();
});
