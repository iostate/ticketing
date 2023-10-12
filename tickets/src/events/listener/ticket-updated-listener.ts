import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@sgtickets3/common';
import stan, { Stan } from 'node-nats-streaming';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = 'payments-service';

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: TicketCreatedEvent['data'], msg: stan.Message) {
    console.log(data);
    msg.ack();
  }
}
