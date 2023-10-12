import mongoose from 'mongoose';
// import nats, {Stan} from 'node-nats-streaming';
import { app } from './app';

// import natsWrapper
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';

// start the mongoose server
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    // connect NATS
    await natsWrapper.connect('ticketing', 'payments-service', 'http://nats-srv:4222');

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

    // Ticket Created Listener
    // const tcl = new TicketCreatedListener(natsWrapper.client);
    // tcl.listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000.........');
});

start();
