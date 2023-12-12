import axios from 'axios';
// import request from 'supertest';

it('should log user in', async () => {
  // const response = await fetch('http://ticketing.dev/api/users/signin', )

  const user = {
    email: 'test@123.com',
    password: '123456a!',
  };

  // const signup = await axios.post(
  //   'http://ticketing.dev/api/users/signup',
  //   // user
  //   {
  //     email: 'test@123.com',
  //     password: '123456a!',
  //   }
  // );
  // console.log(signup.data);

  const login = await axios.post('http://ticketing.dev/api/users/signin', user);
  expect(login.data['email']).toBe(user.email);
  // .then(function (response) {
  //   console.log(response.data);
  // });

  // return response.data;
  // console.log(response.data);
  // {
  // username: 'chernobyl',
  // password: 'testing123',
  // });

  // expect(response).toBe(200);
});

it('should return a Order with an updated version', async () => {});
