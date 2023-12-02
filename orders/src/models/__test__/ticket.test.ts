import mongoose from 'mongoose';
import { Ticket } from '../ticket';

it('should increase version number on save', async () => {
  const objectId = new mongoose.Types.ObjectId().toHexString();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const initTicketData = {
    id: objectId,
    title: 'ticket',
    price: 3000,
  };
  const ticket = Ticket.build(
    //   {
    //     id: 'test',
    //   title: 'ticket',
    //   price: 3000
    // }
    initTicketData
  );
  await ticket.save();
  console.log(ticket);
  // expect(ticket.version).toEqual(0);
  ticket.set({ price: 3000, orderId });
  await ticket.save();
  console.log(ticket);
  expect(ticket.version).toEqual(1);
  console.log(ticket);
});
