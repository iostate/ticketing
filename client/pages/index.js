// import { useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
// import useRequest from '../hooks/use-request';
// import Search from '../components/search';
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

Landing.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    console.log('we are on the server');
    // we are on the server
    // make requests to the ingress-nginx controller http://SERVICE-NAME.NAMESPACe.svc.cluster.local
    // const { data } = await axios.get(
    //   'http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser'
    // );
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );

    return data;
  } else {
    // window is defined, we are on the client
    // make requests using next.js's default baseURL ('')
    console.log('entering here');
    const { data } = await axios.get('/api/users/currentuser');
    console.log(data);
    return data;
  }

  return {};
};

export default Landing;
