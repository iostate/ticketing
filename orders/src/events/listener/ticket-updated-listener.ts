import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@sgtickets3/common';
import { Ticket, TicketDoc } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketNotFoundError } from '../errors/TicketNotFoundError';
// const pino = require('pino')();

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // >>> DEBUG PURPOSES >>>
    console.log(`BEGIN TicketUpdatedListener Event: \n${JSON.stringify(data)}`);
    // <<< DEBUG PURPOSES <<<

    let ticket;
    try {
      ticket = await Ticket.findByEvent({ id: data.id, version: data.version });
      console.log(`CURRENT TicketUpdatedListener Ticket: ${ticket}`);
      if (!ticket) {
        throw new Error(`Ticket not found + ${data.id}`);
      }
    } catch (err: unknown) {
      console.log(err);
    }

    // add randomNumber to document so that version increases
    // Mongoose concurrency control only updates if fields
    // of object are different
    // const randNumb = Math.random() + 10;
    const randNumber = Math.floor(Math.random() * 1000);
    const { title, price, orderId } = data;
    ticket?.set({ title, price, orderId });
    // ticket!.set({ title, price, occTrigger: !ticket!.occTrigger });
    // set flag on
    // ticket?.set({ title, price });
    await ticket!.save();

    msg.ack();
    // try {
    //   ticket = await Ticket.findByEvent({ id: data.id, version: data.version });
    //   if (!ticket) {
    //     throw new TicketNotFoundError('Ticket not found inside Orders Service', {
    //       id: data.id,
    //       version: data.version,
    //     });
    //   }
    // } catch (err: unknown) {
    //   //   // throw new TicketNotFoundError('Ticket not found', data);
    //   console.log(err);
    // } finally {
    //   const { title, price, orderId } = data;
    //   ticket?.set({ title, price, orderId });
    //   await ticket?.save();
    //   if (ticket) {
    //     msg.ack();
    //   }
    // }

    console.log(`END TicketUpdatedListener Event: ${ticket}}`);
  }
}
