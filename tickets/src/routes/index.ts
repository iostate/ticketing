import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@sgtickets3/common';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const allTickets = await Ticket.find();
  res.status(200).json(allTickets);
});

export { router as indexTicketsRouter };
