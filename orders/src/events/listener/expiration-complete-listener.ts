import {
  Listener,
  Subjects,
  OrderStatus,
  ExpirationCompleteEvent,
} from '@sgtickets3/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    console.log('ExpirationComplete Event incoming ' + data.orderId);
    const { orderId } = data;

    // Find order and reset the ticket it is tied to
    const order = await Order.findById(orderId).populate('ticket');
    // console.log(order);

    if (!order) {
      throw new Error('Order not found' + orderId);
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
