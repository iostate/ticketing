import express, { Router } from 'express';

const router = express.Router();

router.delete('/api/posts/:orderId', async (req, res) => {
  const { orderId } = req.params;
  res.status(200).json();
});

export { router as deleteOrderRouter };
