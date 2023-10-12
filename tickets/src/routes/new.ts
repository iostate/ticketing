import express, { Request, Response, NextFunction } from 'express';
import { NotFoundError, requireAuth, validateRequest } from '@sgtickets3/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

import { natsWrapper } from '../nats-wrapper';

import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title required'),
    body('price').isFloat({ gt: 0 }),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    // const { id } = req.currentUser!;
    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await newTicket.save();

    // START PUBLISHER
    // NOTE: do we want to await this operation?
    // Ensure that the data is consistent with what is saved to the database
    // since there are MongoDB hooks for sanitization (pre-save)
    // we do want to await this. Why? We are awaiting the creation of the Document
    // to mongodb
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
    });

    res.status(201).json(newTicket);
  }
);

export { router as createTicketRouter };
