// import { Message } from 'node-nats-streaming';
// import {
//   Listener,
//   NotFoundError,
//   Subjects,
//   TicketUpdatedEvent,
// } from '@sgtickets3/common';
// import { Ticket } from '../../models/ticket';
// import { queueGroupName } from './queue-group-name';

// export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
//   subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

//   queueGroupName: string = queueGroupName;

//   // Operations
//   // 1. Ack message
//   // 2. Perform business logic
//   // 3. Find ticket by event data, specifically id and version
//   // 4. Modify the properties of an existing Ticket
//   async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
//     console.log('data: ');
//     console.log(data);
//     // const { id, version, price, title } = data;
//     // Finding Ticket by version and ID of event
//     const ticket = await Ticket.findByEvent({ id: data.id, version: data.version });
//     // const ticket = await Ticket.findOne({ _id: data.id });
//     // const ticket = await Ticket.findById(data.id);
//     // await ticket.save();

//     console.log('ticket: ');
//     console.log(ticket);

//     if (!ticket) {
//       throw new Error('Ticket not found');
//     }

//     const { title, price, version } = data;
//     ticket.set({ title, price });
//     await ticket.save();
//     msg.ack();
//   }
// }

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@sgtickets3/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
