import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models/tickets';
import { requireAuth } from '../errors/require-auth';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get('/api/tickets/test', (req, res, next) => {
  res.send({ test: 'SUCCESS OK' });
});
router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    console.log(`title: ${title}\nprice: ${price}`);

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
