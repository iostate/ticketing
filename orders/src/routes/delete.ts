/**
 *A 204 Status Code is a 'No Content' and will not
 * return a JSON object
 */

import { NotAuthorizedError, NotFoundError, requireAuth } from '@sgtickets3/common';
import express from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
  const { orderId } = req.params;

  // const order = await Order.findById(orderId).populate('ticket');
  const order = await Order.findById(orderId).populate('ticket');
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

  // console.log(
  //   JSON.stringify({
  //     id: order.id,
  //     version: order.version,
  //     ticket: {
  //       id: order.ticket.id,
  //     },
  //   })
  // );
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send();
});

export { router as deleteOrderRouter };
