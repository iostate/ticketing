import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@sgtickets3/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  // Acknowledge the Message using msg.ack()
  // Perform business logic
  // Save ticket to Orders database
  // Orders service needs to know ticket information
  async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    msg.ack(); // acknowledge ticket
  }
}
