import express from 'express';
import { Order } from '../models/order';
import { NotAuthorizedError, NotFoundError } from '@sgtickets3/common';

const router = express.Router();

router.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate('ticket');

  // Order was not found
  if (!order) {
    throw new NotFoundError();
  }

  // User not authorized to view this Order
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // Successful response with Order
  res.status(200).json(order);
});

export { router as getOrderRouter };
