import nats, { Stan } from 'node-nats-streaming';

export class NatsWrapper {
  private _client?: Stan;

  get client() {
    // if the client has not been connected/defined
    // client gets defined when calling connect
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this._client!.on('error', (err) => {
        console.log(err);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
