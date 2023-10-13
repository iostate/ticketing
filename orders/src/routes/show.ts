import express, { Router } from 'express';

const router = express.Router();

router.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  res.status(200).json();
});

export { router as getOrderRouter };
