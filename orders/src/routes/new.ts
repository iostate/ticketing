import express, { Router } from 'express';

const router = express.Router();

router.post('/api/orders', async (req, res) => {
  res.status(200).json();
});

export { router as newOrderRouter };
