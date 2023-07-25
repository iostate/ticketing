import express from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.session?.currentUser || null });
});

router.get('/api/users/test', (req, res, next) => {
  res.send({ test: 'SUCCESS OK' });
});

export { router as currentUserRouter };
