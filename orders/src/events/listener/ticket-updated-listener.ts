import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@sgtickets3/common';
import { Ticket, TicketDoc } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // >>> DEBUG PURPOSES >>>
    // console.log(
    //   `Event is being received for a Ticket that is being updated!\nEvent Data: ${JSON.stringify(
    //     data
    //   )}`
    // );
    // <<< DEBUG PURPOSES <<<

    let ticket;
    try {
      ticket = await Ticket.findByEvent({ id: data.id, version: data.version });
      if (!ticket) {
        throw new TicketNotFoundError('Ticket not found inside Orders Service', {
          id: data.id,
          version: data.version,
        });
      }
    } catch (err: unknown) {
      //   // throw new TicketNotFoundError('Ticket not found', data);
      console.log(err);
    } finally {
      const { title, price, orderId } = data;
      ticket?.set({ title, price, orderId });
      await ticket?.save();
      if (ticket) {
        msg.ack();
      }
    }
  }
}
