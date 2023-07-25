import axios from 'axios';
import buildClient from '../api/build-client';
import Link from 'next/link';
import Router from 'next/router';
const Landing = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <div>
      <h1>Landing Page</h1>
      <Link href='/auth/signup'>
        <button type='button' class='btn btn-link'>
          Sign Up
        </button>
      </Link>
      {/* <Search /> */}
      {/* {currentUser} */}
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
