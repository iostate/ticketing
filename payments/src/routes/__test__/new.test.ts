import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import mongoose from 'mongoose';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';
// jest.mock('../../stripe');

it('returns a 404 if the order does not exist', async () => {
  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asjddas',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: order.id,
      token: '1awdsdas',
    })
    .expect(401);
});

it('should return a 400 if trying to purchase a cancelled order', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(order.userId))
    .send({
      orderId: order.id,
      token: '1awdsdas',
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    // userId: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  // Used with jest mocked stripe.charges.create function
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(10 * 100);
  // expect(chargeOptions.currency).toEqual('usd');

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const findCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  expect(findCharge).toBeDefined();
  expect(findCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: findCharge?.id,
  });
  expect(payment).not.toBeNull();
});
