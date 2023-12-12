import { ExpirationCompleteEvent, OrderStatus } from '@sgtickets3/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: userId,
    title: 'Ticket Test',
    price: 3010,
    orderId: 'adsf',
  });
  await ticket.save();

  const order = Order.build({
    userId,
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, ticket };
};

it('cancels the order', async () => {
  const { listener, data, msg, order, ticket } = await setup();

  await listener.onMessage(data, msg);

  const foundOrder = await Order.findById(order.id);

  expect(foundOrder!.status).toEqual(OrderStatus.Cancelled);
});
