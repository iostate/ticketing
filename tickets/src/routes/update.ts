import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@sgtickets3/common';
import { Ticket } from '../models/ticket';

// natsWrapper
// ticketUpdatedListener
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title required'),
    body('price').isFloat({ gt: 0 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.params.id);
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError(); // 404
    }
    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError(); // 401
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    // await natsWrapper.connect('ticketing', 'abcd', 'http://nats-srv:4222');
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
