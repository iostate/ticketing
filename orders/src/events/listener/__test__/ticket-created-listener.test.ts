import mongoose from 'mongoose';
import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@sgtickets3/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // @ts-ignore
  const listener = new TicketCreatedListener(natsWrapper.client);
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const data: TicketCreatedEvent['data'] = {
    id: ticketId,
    version: 0,
    title: 'Phoenix Suns',
    price: 3001,
    userId,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const { id, version } = data;
  const ticket = await Ticket.findById(id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.version).toEqual(data.version);
});

it('acks a message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
