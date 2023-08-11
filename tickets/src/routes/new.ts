import express, { Request, Response, NextFunction } from 'express';
import { NotFoundError, requireAuth, validateRequest } from '@sgtickets3/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
// import { requireAuth } from '@sgtickets/common';
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
    console.log(req.body);
    const { title, price } = req.body;
    // const { id } = req.currentUser!;
    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await newTicket.save();
    console.log(newTicket.id);

    // console.log(req.currentUser);
    // console.log(req.session);
    res.status(201).json(newTicket);
  }
);

export { router as createTicketRouter };
