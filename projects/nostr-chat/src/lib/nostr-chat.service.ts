import { Inject, Injectable } from '@angular/core';
import { Relay, getEventHash, nip04, relayInit, signEvent, Sub, Event } from 'nostr-tools';
import { BehaviorSubject, Observable, Subject, debounceTime } from 'rxjs';
import { Message } from './message';

export const CHAT_SERVICE_CONFIG = Symbol("CHAT_SERVICE_CONFIG")

export interface ChatServiceConfig {
  relayUrl: string
}

export const CHAT_CONTACTS_LOCAL_STORAGE_KEY = "chat_contacts"



@Injectable()
export class ChatService {

  

  private relay: Relay;
  private currAcctRelaySubscription: Sub | null = null;

  private currentAcctSub = new BehaviorSubject<[string, string] | null>(null);
  currentAcct$ = this.currentAcctSub.asObservable();

  private contacts: Record<string, string[]> ;
  private contactsSub = new BehaviorSubject<Record<string, string[]>>({});
  private contacts$ = this.contactsSub.asObservable().pipe(debounceTime(1000));

  private currentAcctContactsSub = new BehaviorSubject<string[]>([]);
  currentAcctContacts$ = this.currentAcctContactsSub.asObservable();

  private currAcctIndexedMsgs: Record<string, Message[]> | null = null;
  private currAcctIndexedMsgsSub =  new BehaviorSubject<Record<string, Message[]> | null>(null);
  indexedMsgs$ = this.currAcctIndexedMsgsSub.asObservable().pipe(debounceTime(1000));




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

      this.contacts = this.loadContactsFromLocalStorage();
      this.contacts$.subscribe( c => {
        this.saveContactsToLocalStorage(c);
        const currAcct = this.currentAcctSub.getValue();
        if(currAcct && this.contacts){
          this.currentAcctContactsSub.next(this.contacts[currAcct[1]])
        }
      });

      this.currentAcct$.subscribe((acct) => {
        if(!acct){
          this.currentAcctContactsSub.next([]);
          return;
        }
        const [sk, pk] = acct;
        // new account public key comes in
        
        // unsubscribe previous account subscription to relay
        if(this.currAcctRelaySubscription){
          this.currAcctRelaySubscription.unsub();
        }

        // update contacts for the account if any
        
        let currentContacts: any[] | null = null;
        if(this.contacts){
          currentContacts = this.contacts[pk] || [];
        } else {
          currentContacts = [];
        }
        this.currentAcctContactsSub.next(currentContacts);
       

        // prepare update indexed messages 
        this.currAcctIndexedMsgs = {};

        this.subCurrAcctMessages(sk, pk);


        
      })
  }

  public getMessages(sk: string, pk: string, until: number, limit:number): Promise<Event[]> {
    return this.relay.list([
      {
        kinds: [4],
        authors:[pk],
        limit,
        until
      },
      {
        kinds: [4],
        "#p": [pk], // sent to me
        limit,
        until
      }
    ])
  }

  private subCurrAcctMessages(sk: string, pk: string){
    let sub = this.relay.sub([
      {
        kinds: [4],
        authors: [pk], // what I sent
       
      },
      {
        kinds: [4],
        "#p": [pk] // sent to me
      }
    ]);
    
    

    sub.on('event', async event => {
      const tagPArr = event.tags.find(tag=> tag[0] == "p");
      let tagP = null;
      if(!tagPArr) {
        console.log("ignore event because no tag p")
        return;
      }
      tagP = tagPArr[1];
      // TODO: verify signature
      try {
        const pkToDecr = pk == event.pubkey ? tagP: event.pubkey;
        const content = await nip04.decrypt(sk, pkToDecr, event.content);

      this.onRecvNewMessage({
        id: event.id,
        fromPk: event.pubkey,
        toPk: tagP,
        createdAt: event.created_at,
        content
      }, pk);
      } catch(err){
        console.error("decrypt message error", event);
      }
      
      

    });
  }

  private onRecvNewMessage(msg: Message, currAcctPk:string) {
    if(msg.fromPk == currAcctPk){
      // this is the message I sent
      if(msg.toPk in this.currAcctIndexedMsgs!){
        const msgs = this.currAcctIndexedMsgs![msg.toPk];
        for (const m of msgs) {
          if(m.id == msg.id){
            return;
          }
        }
        msgs.push(msg)
      } else {
        this.currAcctIndexedMsgs![msg.toPk] = [msg];
      }
    } else {
      // this is the message sent to me
      if(msg.fromPk in this.currAcctIndexedMsgs!){
        const msgs = this.currAcctIndexedMsgs![msg.fromPk];
        for (const m of msgs) {
          if(m.id == msg.id){
            return;
          }
        }
        msgs.push(msg)
      } else {
        this.currAcctIndexedMsgs![msg.fromPk] = [msg];
      }
    }
    

    // recover contact if message sender or receiver is not in contacts
    if(msg.fromPk != currAcctPk){
      this.addContact(currAcctPk, msg.fromPk);
    } else if(msg.toPk != currAcctPk){
      this.addContact(currAcctPk, msg.toPk);
    }

    // notify
    this.currAcctIndexedMsgsSub.next(this.currAcctIndexedMsgs)

  }

  updateCurrentAcct(sk: string, pk: string) {
    this.currentAcctSub.next([sk, pk]);
  }

  private loadContactsFromLocalStorage(): Record<string, string[]>  {
    const res = localStorage.getItem(CHAT_CONTACTS_LOCAL_STORAGE_KEY);
    if(res == null){
        return {};
    }
    return JSON.parse(res);
  }

  private saveContactsToLocalStorage(c: Record<string, string[]> | null) {
    if(!c){
      localStorage.removeItem(CHAT_CONTACTS_LOCAL_STORAGE_KEY);
      return;
    }
    const val = JSON.stringify(c);
    localStorage.setItem(CHAT_CONTACTS_LOCAL_STORAGE_KEY, val)
  }

  addContact(from: string, to: string) {
    
    if (! (from in this.contacts)){
      this.contacts[from] = [to];
    } else {
      for (const c of this.contacts[from]) {
          if(c == to){
            return;
          }
      }
      this.contacts[from].push(to);
    };
    this.contactsSub.next(this.contacts);
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
