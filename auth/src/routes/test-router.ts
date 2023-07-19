import { Router } from 'express';

const router = Router();

router.post('/api/tickets/testing', (req, res, next) => {
  res.send({ success: true });
});

export { router as testTicketRouter };
