import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sgtickets3/common';
import { TicketDoc } from './ticket';
export { OrderStatus };

// userId, status
// ticket
// version
interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
  // expiresAt: Date;
  // ticket: TicketDoc;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  // expiresAt: Date;
  version: number;
  price: number;
  // ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      // enum: Object.values(OrderStatus),
      // default: OrderStatus.Created,
    },
    // expiresAt: {
    //   type: mongoose.Schema.Types.Date,
    // },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    // TODO: Working on applying a different approach to optimistic concurrency
    // control
    // optimisticConcurrency: true,
    // versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    version: attrs.version,
    status: attrs.status,
    price: attrs.price,
  });
  // return new Order({
  //   _id: attrs.id
  // })
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
