// import axios from 'axios';

// // destructure req from context
// export default ({ req }) => {
//   if (typeof window === 'undefined') {
//     console.log('running on server');
//     // running on server
//     return axios.create({
//       baseUrl: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
//       headers: req.headers,
//     });
//   } else {
//     console.log('running on client');
//     return axios.create({
//       baseUrl: '/',
//     });
//   }
// };
import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};
