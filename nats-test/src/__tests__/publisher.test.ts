import nats from 'node-nats-streaming';
console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('publisher connected');

  stan.on('close', () => {
    process.exit();
  });

  const data = JSON.stringify({
    id: '123',
    title: 'hello world',
    price: 20,
  });
  stan.publish('ticket:created', data, () => {
    console.log('data published');
  });
});

process.on('SIGNINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
