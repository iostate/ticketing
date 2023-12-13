import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@sgtickets3/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../models/order';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id,
      userId,
      status,
      version,
      ticket: { price },
    } = data;

    // console.log(`data expected: ${JSON.stringify(data)}`);
    const order = Order.build({ id, userId, status, version, price });
    await order.save();

    const newOrder = await Order.findById(order.id);
    // console.log(newOrder);

    msg.ack();
  }
}
