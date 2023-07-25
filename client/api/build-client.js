// import axios from 'axios';

// destructure req from context
export default ({ req }) => {
  if (typeof window === 'undefined') {
    console.log('running on server');
    // running on server

    return axios.create({
      // baseURL allows axios global config
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    console.log('running on client');
    return axios.create({
      baseUrl: '/',
    });
  }
};
