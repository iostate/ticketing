import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';
import { BadRequestError, NotFoundError, requireAuth } from '@sgtickets3/common';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

// Create a new order with a ticketId associated with it
router.post(
  '/api/orders',
  requireAuth,
  // custom validator to ensure that the ticketId is a ObjectId
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided or is not valid'),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that the ticket is not already reserved
    // Run query, find Order with same ticket as above,
    // AND ensure ticket status is *NOT* cancelled
    const isReserved = await ticket!.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Set expiration date for ticket
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); // 15 minutes

    // Build the Order
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    // save to database
    await order.save();

    // Publish Order to let event bus know that an Order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).json(order);
  }
);

export { router as newOrderRouter };
