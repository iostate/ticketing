import { Listener, Subjects, OrderCreatedEvent } from '@sgtickets3/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

/**
 * If an Order is created, then a ticket must be updated with the orderId.
 */
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    // Perform some logic to reserve this ticket
    if (!ticket) {
      throw new Error('ticket was not found inside OrderCreatedListener');
    }

    ticket.set({
      orderId: data.id,
    });
    await ticket.save();

    /**
     * Publish an event to TicketUpdatedPublisher that sends orderId.
     * orderId present on the Ticket in Tickets Service represents that it
     * has an owner and the Ticket is reserved.
     */
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    msg.ack();
  }
}
