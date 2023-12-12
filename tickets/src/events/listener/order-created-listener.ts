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
    // console.log(`order Created: ${JSON.stringify(data)}`);
    console.log(`BEGIN OrderCreatedListener. Order Created: ${JSON.stringify(data)}\n`);

    const ticket = await Ticket.findById(data.ticket.id);
    console.log(`CURRENT OrderCreatedListener: \n ${ticket}\n`);
    // Perform some logic to reserve this ticket
    if (!ticket) {
      throw new Error('ticket was not found inside OrderCreatedListener');
    }

    ticket.set({
      orderId: data.id,
    });
    await ticket.save();
    // console.log(`order Created ticket: ${ticket}`);

    const dataToSend = {
      id: ticket.id,
      orderId: ticket.orderId,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    };

    console.log(
      `END OrderCreatedListener. Order Created: ${JSON.stringify(dataToSend)}\n`
    );
    /**
     * Publish an event to TicketUpdatedPublisher that sends orderId.
     * orderId present on the Ticket in Tickets Service represents that it
     * has an owner and the Ticket is reserved.
     */
    await new TicketUpdatedPublisher(this.client).publish(
      dataToSend
      // {
      // id: ticket.id,
      // orderId: ticket.orderId,
      // version: ticket.version,
      // title: ticket.title,
      // price: ticket.price,
      // userId: ticket.userId,
      // }
    );

    msg.ack();
  }
}
