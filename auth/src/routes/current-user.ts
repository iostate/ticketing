import express from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../errors/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.session?.currentUser || null });
});

export { router as currentUserRouter };
