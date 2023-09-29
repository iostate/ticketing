import { Listener } from './events/base-listener';
import { randomBytes } from 'crypto';
import stan, { Stan } from 'node-nats-streaming';

export class TicketUpdateListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'queue-group-name';

  constructor(client: Stan) {
    super(client);
    // this.subject = subject;
    // this.queueGroupName = queueGroupName;
  }
  onMessage(data: any, msg: stan.Message): void {
    console.log('Event data!', data);
    msg.ack();
  }
}
