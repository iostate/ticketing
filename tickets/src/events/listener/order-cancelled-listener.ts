import { Listener, OrderCancelledEvent, Subjects } from '@sgtickets3/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';
// import logger from 'pino-http'
// import logger from 'pino';
const logger = require('pino')();

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // >>> DEBUG
    console.log(`BEGIN OrderCancelledListener Event: \n${JSON.stringify(data)}\n`);
    // <<< DEBUG

    /**
     * When an Order is cancelled, set orderId property to empty on
     * the ticket.
     */
    const ticket = await Ticket.findById(data.ticket.id);
    console.log(`CURRENT OrderCancelledListener Ticket: ${ticket}\n`);

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ orderId: undefined });
    await ticket.save();

    const dataToSend = {
      id: ticket.id,
      orderId: ticket.orderId,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    };

    console.log(`END OrderCancelledListener Ticket: ${JSON.stringify(dataToSend)}\n`);

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
