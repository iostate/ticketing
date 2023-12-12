// import nats, {Stan} from 'node-nats-streaming';
// import { app } from './app';
import { OrderCreatedListener } from './events/listener/order-created-listener';
// import natsWrapper
import { natsWrapper } from './nats-wrapper';
// import { TicketCreatedListener } from './events/listener/ticket-created-listener';

// start the mongoose server
const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  try {
    // connect NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // event on close
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closing...');
      process.exit();
    });

    // event terminate
    process.on('SIGINT', () => {
      process.exit();
    });

    // event terminate
    process.on('SIGTERM', () => {
      process.exit();
    });
  } catch (err) {
    console.error(err);
  }

  const ocl = new OrderCreatedListener(natsWrapper.client);
  ocl.listen();
};

start();
