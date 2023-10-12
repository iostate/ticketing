import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@sgtickets3/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
