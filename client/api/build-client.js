import axios from 'axios';

// destructure req from context
export default ({ req }) => {
  if (typeof window === 'undefined') {
    console.log('running on server');
    // running on server

    return axios.create({
      // baseURL allows axios global config
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: 'http://ingress-nginx-controller.default.svc.cluster.local',
      // baseURL: '10.107.4.50',
      // baseURL: 'http:10.1.0.65:80',
      // baseURL: 'http://ticketing.dev',
      headers: req.headers,
    });
  } else {
    console.log('running on client');
    return axios.create({
      baseUrl: '/',
    });
  }
};
