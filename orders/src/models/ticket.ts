// import mongoose from 'mongoose';
// import { Order, OrderStatus } from './order';

// interface TicketAttrs {
//   title: string;
//   price: number;
// }

// export interface TicketDoc extends mongoose.Document {
//   title: string;
//   price: number;
//   isReserved(): Promise<boolean>;
// }

// interface TicketModel extends mongoose.Model<TicketDoc> {
//   build(attrs: TicketAttrs): TicketDoc;
// }

// const ticketSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     toJSON: {
//       transform(doc, ret) {
//         ret.id = ret._id;
//         delete ret._id;
//       },
//     },
//   }
// );

// // Add a function to the TicketModel itself
// ticketSchema.statics.build = (attrs: TicketAttrs) => {
//   return new Ticket(attrs);
// };

// // Add a new method to a Document using methods
// /**
//  * isReserved checks whether an existing ticket is reserved already.
//  * A ticket is reserved if it has an associated order with it.
//  */
// ticketSchema.methods.isReserved = async function () {
//   // find the ticket by id
//   // const ticket = await Ticket.findOne()

//   const existingOrder = await Order.findOne({
//     ticket: this,
//     status: {
//       // Check for status that are *NOT* completed
//       $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
//     },
//   });

//   // !(null) == true
//   // !(!(null)) == false
//   return !!existingOrder;
// };

// const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

// export { Ticket };

import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
