import { Publisher, PaymentCreatedEvent, Subjects } from '@sgtickets3/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
