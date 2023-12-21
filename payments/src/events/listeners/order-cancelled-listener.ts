import { OrderCancelledEvent, Listener, Subjects, OrderStatus } from '@sgtickets3/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from '../queue-group-name';

/**
 * Order cancelled?
 * 1. Set Order status property to cancelled
 * 2. Unreserve the ticket?
 */
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const {
      id,
      version,
      ticket: { id: ticketId },
    } = data;

    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    if (!order) {
      throw new Error('Order being cancelled not found ' + id);
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    msg.ack();
  }
}
