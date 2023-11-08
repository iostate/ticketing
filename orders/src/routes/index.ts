/**
 * Show all Order documents for a User.
 *
 * The UserId can be retrieved using req.currentUser.id
 *
 * Successful Status Code: 200
 *
 * An error will be returned if no Orders are found.
 * Error Status Code: 400
 **/
import express, { Router } from 'express';
import { Order } from '../models/order';
import { NotFoundError, requireAuth } from '@sgtickets3/common';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req, res) => {
  const { orderId } = req.params;

  // Find all Orders with userId
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');

  // Order was not found
  if (!orders) {
    throw new NotFoundError();
  }

  // User not authorized to view this Order
  // if (order.userId !== req.currentUser!.id) {
  //   throw new NotAuthorizedError();
  // }

  res.status(200).send(orders);
});

export { router as indexOrderRouter };
