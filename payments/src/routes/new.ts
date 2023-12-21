import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@sgtickets3/common';

import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status == OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot make payment on order that is already cancelled');
    }

    // const customer = await stripe.customers.create({
    //   name: 'Jenny Rosen',
    //   email: 'jennyrosen@example.com',
    // });

    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     number: '4242424242424242',
    //     exp_month: 8,
    //     exp_year: 2026,
    //     cvc: '314',
    //   },
    // });

    // await stripe.paymentIntents.create({
    //   currency: 'usd',
    //   amount: order.price,
    //   receipt_email: 'qmtruong92@gmail.com',
    //   customer: customer.id,
    //   payment_method: paymentMethod.id,
    //   payment_method_types: ['card'],
    //   confirm: true,
    // });

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      // description: 'test'
    });

    const payment = Payment.build({
      stripeId: charge.id,
      orderId: order.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      stripeId: payment.stripeId,
      orderId: payment.orderId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
