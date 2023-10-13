import express, { Router } from 'express';

const router = express.Router();
router.get('/api/orders', async (req, res) => {
  res.status(200).json({});
});

export { router as indexOrderRouter };
