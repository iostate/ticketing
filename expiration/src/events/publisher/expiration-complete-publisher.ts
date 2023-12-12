import { Subjects, ExpirationCompleteEvent, Publisher } from '@sgtickets3/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
