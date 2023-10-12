import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@sgtickets3/common';
import stan, { Stan } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: TicketCreatedEvent['data'], msg: stan.Message) {
    console.log(data);
    msg.ack();
  }
}
