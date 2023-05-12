import { Inject, Injectable } from '@angular/core';
import { Relay, getEventHash, nip04, relayInit, signEvent } from 'nostr-tools';

export const CHAT_SERVICE_CONFIG = Symbol("CHAT_SERVICE_CONFIG")

export interface ChatServiceConfig {
  relayUrl: string
}

@Injectable()
export class ChatService {

  

  private relay: Relay;

  constructor(@Inject(CHAT_SERVICE_CONFIG) private readonly config: ChatServiceConfig) {
      this.relay = relayInit(this.config.relayUrl);
      this.relay.on('error', () => {
        console.error("relay error")
      });
      this.relay.on("connect", () => {
        console.log("relay connected")
      });
      this.relay.on("disconnect", () => {
        console.log("relay disconnected")
      })
      this.relay.connect();
  }


  async sendDirectMessage(sk1:string, pk1:string, pk2:string, message:string): Promise<void> {
      let ciphertext = await nip04.encrypt(sk1, pk2, message);
      let event = {
          kind: 4,
          pubkey: pk1,
          tags: [['p', pk2]],
          content: ciphertext,
          created_at: Math.floor(Date.now() / 1000)
        } as any;

        event.id = getEventHash(event);
        event.sig = signEvent(event, sk1);
        
        this.relay.publish(event);
        
  }
}
