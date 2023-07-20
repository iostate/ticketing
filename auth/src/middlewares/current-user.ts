// // import { Request, Response, NextFunction } from 'express';
// // import jwt from 'jsonwebtoken';

// // interface UserPayload {
// //   id: string;
// //   email: string;
// // }

// // declare global {
// //   namespace Express {
// //     interface Request {
// //       currentUser?: UserPayload;
// //     }
// //   }
// // }

// // export const currentUser = (req: Request, res: Response, next: NextFunction) => {
// //   // if req.session.jwt does not exist
// //   // TODO: DEBUG
// //   //   console.log(req.session);
// //   if (!req.session?.jwt) {
// //     console.log('req.session.jwt not set');
// //     return next();
// //   }

// //   //   console.log('3 here');
// //   //   sign in must have occurred
// //   //   try {
// //   // console.log('3');
// //   const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
// //   console.log('payload set');
// //   console.log(payload);
// //   req.currentUser = payload;
// //   // console.log(req.currentUser);
// //   //   console.log(payload);
// //   //   res.send({ currentUser: payload });
// //   //   } catch (err) {
// //   // console.error(err);
// //   // res.send({ currentUser: null });
// //   //   }

// //   next();
// // };

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface UserPayload {
//   id: string;
//   email: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserPayload;
//     }
//   }
// }

// export const currentUser = (req: Request, res: Response, next: NextFunction) => {
//   // if (!req.session?.jwt) {
//   //   // console.log('req.session.jwt: ', req.session?.jwt);
//   //   return res.send({ currentUser: null });
//   // }
//   // //   session is sending correctly
//   // //   if (req.session?.jwt) {
//   // //     res.send({ currentUser: 'SUCCESS OK' });
//   // //   }

//   // try {
//   //   const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
//   //   req.currentUser = payload;
//   // } catch (err) {}

//   if (!req.session?.jwt) {
//     console.log('req.session.jwt not found at current-user.ts:77');
//     return next();
//   }

//   try {
//     console.log(`req.session.jwt at current-user.ts:82: ${req.session.jwt}`);
//     console.log(`process.env.JWT_KEY at current-user.ts:83: ${process.env.JWT_KEY}`);
//     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
//     req.currentUser = payload;
//     console.log(`payload at current-user.ts:83`);
//     console.log(payload);
//   } catch (err) {}

//   next();
//   //   try {
//   //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
//   //     console.log(payload);
//   //     req.session.currentUser = payload;
//   //     res.send({ currentUser: payload });
//   //   } catch (err) {
//   //     res.send({ currentUser: null });
//   //   }
// };

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.session.currentUser = payload;
    console.log(`payload: ${req.session.currentUser}`);
    // console.log(req.session.currentUser);
  } catch (err) {}

  next();
};
