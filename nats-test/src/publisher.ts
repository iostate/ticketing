/**
 * Must perform port forwarding to access client.
 *
 * Command: kubectl port-forward nats-depl-dfc688ffd-qqt5l 4222:4222
 */
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './ticket-created-publisher';
import { Subjects } from './events/subjects';
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected');
  const data = {
    id: '123',
    title: 'hello world',
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish(data);
  } catch (err) {
    console.log(err);
  }

  stan.on('close', () => {
    process.exit();
  });
});

process.on('SIGNINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
