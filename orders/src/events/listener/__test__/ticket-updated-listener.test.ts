import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedListener } from '../ticket-updated-listener';

import { TicketUpdatedEvent } from '@sgtickets3/common';
import { Ticket } from '../../../models/ticket';
import mongoose, { Error } from 'mongoose';

const setup = async () => {
  // @ts-ignore
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await global.buildTicket();

  // simulate new data for an updated ticket
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: ' new ticket title',
    price: 2019,
    userId: 'asdas',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('should update a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket!.version).toEqual(data.version);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.userId).not.toEqual(data.userId);
});

it('acks a message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack message if skipped version number is found', async () => {
  const { listener, data, msg } = await setup();
  data.version = 20;

  try {
    // Inside of this onMessage will call Ticket.findByEvent(data.id, data.version) which will cause an Error to be thrown since the Ticket is not found. It should also not update the ticket whose event is being received.
    await listener.onMessage(data, msg);
  } catch (err) {
    const knownError = err as Error;
    console.log(typeof knownError);
    console.log(knownError);
    let errMsg;
    let errName;
    if (knownError instanceof Error) {
      let errMsg = knownError.message;
      let errName = knownError.name;
    }
    console.log(errMsg);
    console.log(errName);
  }

  // Find Ticket by event and ID

  // Expect that the ticket have version of 21

  expect(msg.ack).not.toHaveBeenCalled();
});
