import request from 'supertest';
import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@sgtickets3/common';
import { Message } from 'node-nats-streaming';
import { app } from '../../../app';
import mongoose from 'mongoose';

/**
 * Return a Listener, the data adhering to
 * an interface, and a Jest Mocked
 * node-nats-streaming.Message function.
 */
const setup = async () => {
  // @ts-ignore
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'New Ticket',
    price: 3010,
    userId: '1234',
  });
  await ticket.save(); // will generate the ID of the ticket

  // Fake event data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: '1234', // do these not have to match ticket?
    expiresAt: 'testing',
    version: 0,
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

/**
 * Should reserve a ticket by Placing an orderId
 * on a ticket.
 */
it('should reserve a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // check orderId of ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toBeDefined();
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a TicketUpdated event', async () => {
  const { listener, data, ticket, msg } = await setup();

  const { orderId } = ticket;
  await listener.onMessage(data, msg);

  const natsWrapperSpy = jest.spyOn(natsWrapper.client, 'publish');

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  console.log(ticketUpdatedData);

  /**
   * Mock the OrderCreatedListener's NATS client's publish method to
   * ensure that the TicketUpdatedPublisher was called.
   * use natsWrapper to access it.
   */
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  // expect(natsWrapperSpy.mock.calls[0][0].orderId).toBeDefined();

  // expect(natsWrapper.client.publish).toBeCalledTimes(2);
  // console.log(natsWrapperSpy.mock.calls[0]);
  // console.log(natsWrapperSpy.mock.calls[1]);

  // expect(msg.ack).toHaveBeenCalled();
});
