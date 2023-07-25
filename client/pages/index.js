import axios from 'axios';
import buildClient from '../api/build-client';
import Link from 'next/link';
import Router from 'next/router';
const Landing = ({ currentUser }) => {
  return currentUser ? (
    <div>
      <h2>You are currently signed in</h2>
    </div>
  ) : (
    <div>
      <h2>You are currently not signed in</h2>
    </div>
  );
};

// https://nextjs.org/docs/pages/api-reference/functions/get-initial-props
// For the initial page load, getInitialProps
// will run on the server only.getInitialProps
// will then also run on the client when
// navigating to a different route with the
// next / link component or by using next/router.
Landing.getInitialProps = async (ctx) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default Landing;
