import { Publisher, OrderCreatedEvent, Subjects } from '@sgtickets3/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
