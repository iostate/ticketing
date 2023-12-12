import axios from 'axios';

const response = async function () {
  const response = await axios.post('http://ticketing.dev/api/users/signup', {
    username: 'chernobyl',
    password: 'testing123',
  });

  console.log(response);
};

response().then();
