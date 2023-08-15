import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  stan.on('close', () => process.exit());
  console.log('Listenening on NATS server');
  const subscriptionOptions = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    subscriptionOptions
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Event Received #${msg.getSequence()}\nEvent Data: ${data}`);
    }

    msg.ack();
  });
});

process.on('SIGNINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
