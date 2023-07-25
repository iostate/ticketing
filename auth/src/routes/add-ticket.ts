import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models/tickets';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import { currentUser } from '../middlewares/current-user';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

// Test User ID: 64b87a5f83791dc0eaaaea15
// Get a ticket by User Id
// router.get('/api/tickets/:userId', async (req, res, next) => {
router.get('/api/tickets/:id', async (req, res, next) => {
  //   const { userId } = req.params;
  const { id } = req.params;
  //   check for existing ticket using id
  //   const existingTicketByUserId = await Ticket.find({ userId: userId });
  const existingTicketById = await Ticket.findById(id);
  //   if (!existingTicketByUserId) {
  if (!existingTicketById) {
    throw new NotFoundError();
  }
  //   res.status(200).send({ existingTicketByUserId });
  res.status(200).send({ existingTicketById });
});

router.post(
  '/api/tickets',
  currentUser,
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
      userId: req.session?.currentUser!.id,
    });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
