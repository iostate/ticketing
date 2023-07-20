import express from 'express';

const router = express.Router();

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

router.post('/api/users/signout', (req, res) => {
  // if (req.session?.currentUser) {
  // must set the entire session to null.
  // this will remove currentUser and all other information
  req.session = null;
  // }
  res.send({});
});

export { router as signoutRouter };
