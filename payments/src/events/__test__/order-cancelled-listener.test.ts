import mongoose from 'mongoose';

import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from '@sgtickets3/common';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 10,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'asdad',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('should cancel an order', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const findOrder = await Order.findById(order.id);

  expect(findOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
