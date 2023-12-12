// import { TicketUpdatedEvent } from '@sgtickets3/common';
interface TicketData {
  id: string;
  version: number;
}
export class TicketNotFoundError extends Error {
  // Log data for the ticket not being found
  // id
  // userId
  // version
  // title
  // price

  private data: TicketData;

  constructor(public message: string, data: TicketData) {
    super(message);
    this.data = data;
    this.printError();
  }

  public printError() {
    console.log(JSON.stringify(this.data));
  }
}
