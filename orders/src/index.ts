import mongoose from 'mongoose';
// import nats, {Stan} from 'node-nats-streaming';
import { app } from './app';

// import natsWrapper
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/listener/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listener/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listener/payment-created-listener';

/**
 * Start the Mongoose server.
 * Checks the Environment variables.
 *
 * NOTE: ENV Variables are set in Kubernetes
 *
 * This service requires a JSONWEBTOKEN key in order to decrypt payloads.
 */
const startMongoose = async () => {
  console.log('Starting....');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.log('Mongoose failed to start...');
    console.log(err);
  }
};

/**
 * Starts NATS Streaming Server.
 * Checks for Environment Variables
 */
const startNats = async () => {
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

    // Start TicketCreatedListener
    const tcl = new TicketCreatedListener(natsWrapper.client).listen();
    // Start TicketUpdatedListener
    const tul = new TicketUpdatedListener(natsWrapper.client).listen();
    // Start ExpirationCompleteListener
    const ecl = new ExpirationCompleteListener(natsWrapper.client).listen();
    // Start PaymentCreatedListener
    const pcl = new PaymentCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log('NATS failed to start...');
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000.........');
});

startMongoose();
startNats();
