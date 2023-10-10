import { Publisher } from './events/base-publisher';
import { Subjects } from './events/subjects';
import { TicketCreatedEvent } from './events/ticket-created-event';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
