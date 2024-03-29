import { Inject, Injectable } from '@angular/core';
import { Relay, getEventHash, nip04, relayInit, signEvent, Sub, Event, UnsignedEvent, Filter } from 'nostr-tools';
import { BehaviorSubject, Observable, Subject, concatMap, debounceTime, distinctUntilChanged, from, map, mergeMap, switchMap, throwError } from 'rxjs';
import { Message } from './message';
import { Contact } from './contact';

export const CHAT_SERVICE_CONFIG = Symbol("CHAT_SERVICE_CONFIG")

export interface ChatServiceConfig {
  relayUrl: string,
  localContact?: boolean
}

export const CHAT_CONTACTS_LOCAL_STORAGE_KEY = "chat_contacts"



export interface Account {
  pk: string;
  sk: string;
}



@Injectable()
export class ChatService {

  private relay: Relay;
  private currAcctRelaySubscription: Sub | null = null;
  private nip07Mode = false;

  // current account
  private accountSub = new BehaviorSubject<Account | null>(null);
  account$ = this.accountSub.asObservable();

  // object saved in localStorage for contact list of the nostr account(s)
  // mapping from account's public key to a list of contacts
  // private localContacts?: Record<string, Contact[]>;
  
  // contact list for current account
  private contactsSub = new BehaviorSubject<Contact[] | null>(null);
  contacts$ = this.contactsSub.asObservable().pipe(debounceTime(1000), distinctUntilChanged());


  // mapping from sender to messages(both you send and sender send)
  private directMessagesSub =  new BehaviorSubject<Record<string, Message[]> | null>(null);
  directMessages$ = this.directMessagesSub.asObservable().pipe(debounceTime(1000));


  get contacts(): Contact[] | null {
    return this.contactsSub.getValue();
  }

  get account(): Account | null {
    return this.accountSub.getValue();
  }

  get directMessages(): Record<string, Message[]> | null {
    return this.directMessagesSub.getValue();
  }



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

      

      // if contacts is updated
      this.contacts$.subscribe( contacts => {
        if(config.localContact){
          if(!this.account){
            return;
          }
          // save to local storage
          this.handleLocalContactUpdate(this.account, contacts);
          return;
        } 
        
        // if managed by nostr
        // send new contact message
        this.updateContacts(contacts || []);
      });

      // if new account is updated
      this.account$.subscribe((acct) => {
        // new account public key comes in

        if(!acct){
          this.contactsSub.next(null);
          return;
        }
        const {sk, pk} = acct;
        
        // unsubscribe previous account subscription to relay
        if(this.currAcctRelaySubscription){
          this.currAcctRelaySubscription.unsub();
        }

        // update contacts for the account if any
        if(this.config.localContact){
          const contactsStorage = this.loadContactsFromLocalStorage();
          const newContacts = contactsStorage[pk];
          this.contactsSub.next(newContacts);
        } else {
          this.getContacts(pk).subscribe({
            next: cs => this.contactsSub.next(cs),
            error: err => console.error(err)
          });
        }

        // listen to messages since now
        this.subCurrAcctMessages(sk, pk);


        
      })
  }

  setNip07Mode(onOrOff: boolean) {
    this.nip07Mode = onOrOff;
  }

  // NIP28
  public createChannel() {
    // TODO
  }

  public setChannelMetadata() {
// TODO
  }

  public createChannelMessage() {
// TODO
  }

  // NIP2
  public updateContacts(contacts: Contact[]): Observable<void>{
    if(!this.account){
      return throwError(() => `no account set`);
    }
    const {pk, sk} = this.account;
    const event = {
      kind: 3,
      tags: contacts.map(contact => ["p", contact.pk, contact.relay || "", contact.name]) as any,
      content: "",
      created_at: Math.round(Date.now() / 1000),
      pubkey: pk
    } as any;
    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);
    return this.relayPublish(event);
  }

  public getContacts(pk: string): Observable<Contact[] | null> {

    const e2c = (e: Event) => {
      return e.tags.map((arr: any) => {
        return {
          pk: arr[1],
          relay: arr[2],
          name: arr[3]
        } as Contact
      })
    };

    return this.relayList([{
      kinds: [3],
      authors: [pk]
    }]).pipe(map(events => {
      if(events.length == 0) {
        return null;
      } 
      else if(events.length == 1){
        return e2c(events[0])
      }
      else {
        // choose the latest event
        const latestEvent = events.sort((a, b) => b.created_at - a.created_at)[0];
        return e2c(latestEvent)
      }
    }));
  }

  private relayPublish(event: Event): Observable<void> {
    const pub = this.relay.publish(event);
    
    return new Observable(observer => {
      pub.on("ok", ()=> {
        observer.next();
        observer.complete()
      });
      pub.on("failed", (err:any) => {
        observer.error(err);
        observer.complete()
      });
    });
  }

  private relayList(filters: Filter[]): Observable<Event[]> {
    return from(this.relay.list(filters));
  }

  private handleLocalContactUpdate(account: Account, currentContacts: Contact[] | null){
    const acctContSet = this.loadContactsFromLocalStorage();
    acctContSet[account.pk] = currentContacts ? currentContacts : [];
    this.saveContactsToLocalStorage(acctContSet);
  }


  public loadMessagesUntil(sk: string, pk: string, fromPk:string, until: number, limit:number) {
    from(this.relay.list([
      {
        kinds: [4],
        authors:[pk],
        "#p": [fromPk],
        limit,
        until
      },
      {
        kinds: [4],
        authors: [fromPk],
        "#p": [pk], // sent to me
        limit,
        until
      }
    ]))
    .subscribe({
      next: events => {
        const tasks = events.map(e => this.onRecvChatEvent(e, sk, pk));
        from(Promise.all(tasks)).subscribe();
      },
      error: err => console.error("loadMessagesUntil", until, limit, err)
    })
  }

  private async onRecvChatEvent(event: Event, sk:string, pk:string) {
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
        console.error("decrypt message error", event, err);
      }
      
  }

  private subCurrAcctMessages(sk: string, pk: string){
    let sub = this.relay.sub([
      {
        kinds: [4],
        authors: [pk], // what I sent
        since: Math.round(Date.now() / 1000)
      },
      {
        kinds: [4],
        "#p": [pk], // sent to me
        since: Math.round(Date.now() / 1000)
      }
    ]);
    
    

    sub.on('event', event => this.onRecvChatEvent(event, sk, pk));
  }

  private onRecvNewMessage(msg: Message, currAcctPk:string) {
    const directedMessages = this.directMessages || {};
    if(msg.fromPk == currAcctPk){
      // this is the message I sent
      if(msg.toPk in directedMessages){
        const msgs = directedMessages[msg.toPk];
        for (const m of msgs) {
          if(m.id == msg.id){
            return;
          }
        }
        msgs.push(msg)
      } else {
        directedMessages[msg.toPk] = [msg];
      }
    } else {
      // this is the message sent to me
      if(msg.fromPk in directedMessages){
        const msgs = directedMessages[msg.fromPk];
        for (const m of msgs) {
          if(m.id == msg.id){
            return;
          }
        }
        msgs.push(msg)
      } else {
        directedMessages[msg.fromPk] = [msg];
      }
    }
    

    // recover contact if message sender or receiver is not in contacts
    // if(msg.fromPk != currAcctPk){
    //   this.addContact(currAcctPk, msg.fromPk);
    // } else if(msg.toPk != currAcctPk){
    //   this.addContact(currAcctPk, msg.toPk);
    // }

    // notify
    this.directMessagesSub.next(directedMessages)

  }

  updateAccount(sk: string, pk: string) {
    this.accountSub.next({sk, pk});
  }

  private loadContactsFromLocalStorage(): Record<string, Contact[]>  {
    const res = localStorage.getItem(CHAT_CONTACTS_LOCAL_STORAGE_KEY);
    if(res == null){
        return {};
    }
    return JSON.parse(res);
  }

  private saveContactsToLocalStorage(c: Record<string, Contact[]> | null) {
    if(!c){
      localStorage.removeItem(CHAT_CONTACTS_LOCAL_STORAGE_KEY);
      return;
    }
    const val = JSON.stringify(c);
    localStorage.setItem(CHAT_CONTACTS_LOCAL_STORAGE_KEY, val)
  }

  addContact(pk:string, name?:string) {
    if(!this.contacts){
      this.contactsSub.next([{
        pk,
        name
      }]);
      return;
    } else {
      if(this.contacts.find(contact => contact.pk == pk)){
        return;
      }
      this.contactsSub.next([...this.contacts, {pk, name}])
    }
  }

  updateContactName(pk: string, name: string) {
    if(!this.contacts){
      return;
    }
    const c = this.contacts.find(contact => contact.pk == pk);
    if(!c){
      return;
    }
    c.name = name;
    this.contactsSub.next([...this.contacts]);
  }


  sendDirectMessage(sk1:string | null, pk1:string | null, pk2:string, message:string): Observable<void> {
    if(!pk2){
      return throwError(()=>`missing receiver's public key`);
    }

    if(this.nip07Mode){
      // If in nip07 mode, we are going to encrypt message by using windows.nostr.nip04.encrypt
      const encryptFunc = (window as any).nostr?.nip04?.encrypt;
      const signEventFunc = (window as any).nostr?.signEvent;
      if(!encryptFunc){
        return throwError(() => "missing 'window.nostr.nip04.encrypt', check NIP-07 provider");
      }
      if(!signEventFunc){
        return throwError(() => "missing 'window.nostr.signEvent', check NIP-07 provider");
      }
      return from(encryptFunc(pk2, message))
      .pipe(
        concatMap(ciphertext => {
          let event = {
            kind: 4,
            tags: [['p', pk2]],
            content: ciphertext,
            created_at: Math.floor(Date.now() / 1000)
          } as any;
          
          return from(signEventFunc(event));
        }),
        concatMap((event) => {
          return this.relayPublish(event as any)
        })
      )

    }

    // if not in nip07 mode, then sk1 and pk1 are necessary
    if(!sk1){
      return throwError(()=> `missing sender's public key`)
    }

    if(!pk1) {
      return throwError(()=> `missing sender's private key`)
    }

    return from(nip04.encrypt(sk1, pk2, message))
    .pipe(
      concatMap(ciphertext => {
        let event = {
          kind: 4,
          pubkey: pk1,
          tags: [['p', pk2]],
          content: ciphertext,
          created_at: Math.floor(Date.now() / 1000)
        } as any;

        event.id = getEventHash(event);
        event.sig = signEvent(event, sk1);
        return this.relayPublish(event)
      })
    )
  }
}
