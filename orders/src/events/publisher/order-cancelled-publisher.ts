import { Publisher, OrderCancelledEvent, Subjects } from '@sgtickets3/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
