import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@sgtickets3/common';
const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'NEW',
    price: 3000,
    userId: 'asdf',
  });
  ticket.set({ orderId });
  await ticket.save();

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  return { listener, msg, data, orderId, ticket };
};

it('should call the order cancelled event', async () => {
  const { listener, data, msg, ticket, orderId } = await setup();

  const ticketOne = await Ticket.findById(ticket.id);
  expect(ticketOne!.orderId).toBeDefined();

  await listener.onMessage(data, msg);
  const foundTicket = await Ticket.findById(ticket.id);
  expect(foundTicket!.orderId).not.toBeDefined();
  // ticket orderId should now be undefined

  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
