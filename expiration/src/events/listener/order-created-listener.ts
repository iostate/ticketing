import { Listener, OrderCreatedEvent, Subjects } from '@sgtickets3/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from '../queueGroupName';
import { expirationQueue } from '../../queues/expirationQueue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // const timeToExpire = new Date(data.expiresAt).getTime() - new Date().getTime();
    // const timeToExpire = 120000;
    const timeToExpire = 12000;
    console.log('Waiting this many milliseconds to process the job: ', timeToExpire);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: timeToExpire,
      }
    );

    msg.ack();
  }
}
