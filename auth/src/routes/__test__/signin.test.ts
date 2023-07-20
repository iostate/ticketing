import request from 'supertest';
import { app } from '../../app';
import { signinRouter } from '../signin';

const signInRoute = '/api/users/signin';
const signUpRoute = '/api/users/signup';

const credentials = {
  email: 'qmtruong92@gmail.com',
  password: 'testpassword',
};

it('should fail when an email that does not exist is supplied', async () => {
  await request(app)
    .post(signInRoute)
    .send({
      email: 'test@oakdwa.com',
      password: 'test123',
    })
    .expect(400);
});

it('should return a 200 upon successful sign in', async () => {
  // simulate sign up since the mongo server is tore down on every test
  await request(app).post(signUpRoute).send(credentials);
  // sign in
  await request(app).post(signInRoute).send(credentials).expect(200);
});

it('should return a 400 when an incorrect password is supplied', async () => {
  await request(app).post(signUpRoute).send(credentials);

  const invalidCredentials = credentials;
  invalidCredentials['password'] = 'test123';
  await request(app).post(signInRoute).send(invalidCredentials).expect(400);
});

// it('should return an error stating that the user is already logged in', async () => {

// })

it('should return a 400 upon invalid email and password', async () => {
  await request(app)
    .post(signInRoute)
    .send({
      password: 'q',
    })
    .expect(400);

  await request(app)
    .post(signInRoute)
    .send({
      email: 'qqqq.com',
    })
    .expect(400);
});

it('should return a cookie upon successful sign in', async () => {
  await request(app).post(signUpRoute).send(credentials);
  const response = await request(app).post(signInRoute).send(credentials).expect(200);
  expect(response.get('set-cookie')).toBeDefined();
});
