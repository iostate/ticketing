import Queue from 'bull';
import { natsWrapper } from '../nats-wrapper';
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('expiration-service', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
