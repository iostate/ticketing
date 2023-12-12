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
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  userId: string;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  /**
   * Builds a ticket within the Orders Service. Takes an id,  title and price.
   * @param {string, number} attrs - Ticket attributes.
   * @param {string} attrs.id - ID of the ticket to be created
   * @param {string} attrs.title - Title of the ticket
   * @param {number} attrs.price - Price of the ticket
   *
   * @returns Document<unknown, {}, TicketDoc> New Ticket Mongoose Document
   */
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
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
    optimisticConcurrency: true,
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // Manually assign ID to _id
  // Technical debt
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

/**
 * Finds the same ticket inside Tickets Service.
 * @param event Ticket being received from Tickets Service.
 * @returns {TicketDoc} Returns a Ticket Document.
 */
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
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
