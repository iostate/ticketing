/**
 *A 204 Status Code is a 'No Content' and will not
 * return a JSON object
 */

import { NotAuthorizedError, NotFoundError, requireAuth } from '@sgtickets3/common';
import express from 'express';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
  const { orderId } = req.params;

  // const order = await Order.findById(orderId).populate('ticket');
  const order = await Order.findById(orderId);
  // NotFound
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // set order status to cancelled
  order.status = OrderStatus.Cancelled;
  await order.save();

  res.status(204).send();
});

export { router as deleteOrderRouter };
