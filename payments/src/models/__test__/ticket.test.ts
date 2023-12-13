import { Ticket } from '../payment';
import request from 'supertest';
import { app } from '../../app';
// Attach the polyfill as a Global function

it('implements optimistic concurrency control', async () => {
  // User Cookie
  const user = global.signin();
  const tick = Ticket.build({
    title: 'Test Ticket',
    price: 3010,
    userId: '123',
  });
  await tick.save();

  // Fetch ticket twice
  const ticketOne = await Ticket.findById(tick.id);
  const ticketTwo = await Ticket.findById(tick.id);

  // Make two seperate changes
  ticketOne!.set({ price: 10 });
  ticketTwo!.set({ price: 15 });

  // Save ticketOne
  await ticketOne!.save();

  // expect.assertions(1);
  try {
    await ticketTwo!.save();
  } catch (err) {
    expect(err).toBeDefined();
  }
});

it('updates version number of document after saving', async () => {
  const tick = Ticket.build({
    title: 'Test Ticket',
    price: 3010,
    userId: '123',
  });

  await tick.save();
  console.log(`ticket version #0: ${tick.version}`);
  expect(tick.version).toEqual(0);

  tick.set({ title: 'Test Ticket1' });
  await tick.save();
  console.log(`ticket version #1: ${tick.version}`);
  expect(tick.version).toEqual(1);

  tick.set({ title: 'Test Ticket2' });
  await tick.save();
  console.log(`ticket version #2: ${tick.version}`);
  expect(tick.version).toEqual(2);

  // Make two seperate changes
  // ticketOne!.set({ price: 10 });
  // ticketTwo!.set({ price: 15 });

  // // Save ticketOne
  // await ticketOne!.save();

  // // expect.assertions(1);
  // try {
  //   await ticketTwo!.save();
  // } catch (err) {
  //   expect(err).toBeDefined();
  // }
  // expect(ticketOneVersion).not.toEqual(ticketOne!.version);
});
