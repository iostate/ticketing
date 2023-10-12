/**
 * Must perform port forwarding to access client.
 *
 * Command: kubectl port-forward nats-depl-dfc688ffd-qqt5l 4222:4222
 */
import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
console.clear();
const clientId = randomBytes(4).toString('hex');
// client
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});
import { TicketUpdateListener } from './events/ticket-created-listener';

stan.on('connect', () => {
  stan.on('close', () => process.exit());

  console.log('Listenening on NATS server');
  new TicketUpdateListener(stan).listen();
});

process.on('SIGNINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
