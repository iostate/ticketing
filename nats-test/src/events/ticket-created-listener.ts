import { Listener } from './base-listener';
import { randomBytes } from 'crypto';
import stan, { Stan } from 'node-nats-streaming';

import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketUpdateListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  constructor(client: Stan) {
    super(client);
    // this.subject = subject;
    // this.queueGroupName = queueGroupName;
  }
  onMessage(data: TicketCreatedEvent['data'], msg: stan.Message): void {
    console.log('Event Received!');
    console.log(data);
    // console.log(data.id);
    // console.log(data.title);
    // console.log(data.price);

    msg.ack();
  }
}
