import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { Ticket } from '../models/ticket';
import { NotFoundError, RequestValidationError } from '@sgtickets3/common';
import mongoose from 'mongoose';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  [
    param('id')
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage(`req.params.id must be a valid ObjectId`),
  ],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    res.status(200).send(ticket);
  }
);

export { router as findTicketRouter };
