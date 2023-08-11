import mongoose from 'mongoose';

import { Ticket } from '../../models/ticket';

// async () => {
const ticket = Ticket.findById('64d46a70e03e5f947ff77d19');
const getTicket = async () => {
  try {
    const ticket = await Ticket.findById('64d46a70e03e5f947ff77d19');
    console.log('here');
    console.log(ticket);
  } catch (err) {
    console.log(err);
  }
};

getTicket();
