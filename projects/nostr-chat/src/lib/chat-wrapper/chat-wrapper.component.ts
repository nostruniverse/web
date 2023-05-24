import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Contact } from '../contact';
import { ChatService } from '../nostr-chat.service';
import { BehaviorSubject, Observable, combineLatest, combineLatestAll, combineLatestWith, map, of } from 'rxjs';
import { Message } from '../message';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { UiModule } from 'ui';


export interface NostrAccount {
  sk: string;
  pk: string;
}


@Component({
  template: `
    <div class="p-8 flex flex-col gap-4 bg-white rounded-md">
      <label id="pubk">What's your contact's public key?</label>
      <input for="pubk" [(ngModel)]="pubk" type="text"  class="grow px-2 border border-gray-300 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <div class="flex flex-row gap-4">
        <button ui-button="primary" (click)="dialogRef.close(pubk)">Add</button>
        <button ui-button="warning" (click)="dialogRef.close()">Cancel</button>
      </div>
    </div>
    
  `,
  imports: [
    FormsModule,
    UiModule
  ],
  standalone: true
})
export class ContactPubkeyDialog {
  pubk!: string;

  constructor(public dialogRef: DialogRef<string>) {}
}

@Component({
  template: `
    <div class="p-8 flex flex-col gap-4 bg-white rounded-md">
      <label id="pubk">Public key</label>
      <input for="pubk" [(ngModel)]="data.pk" type="text"  class="grow px-2 border border-gray-300 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">

      <label id="prvtk">Private key</label>
      <input for="prvtk" [(ngModel)]="data.sk" type="text"  class="grow px-2 border border-gray-300 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <div class="flex flex-row gap-4">
        <button ui-button="primary" (click)="dialogRef.close(data)">Add</button>
        <button ui-button="warning" (click)="dialogRef.close()">Cancel</button>
      </div>
    </div>
    
  `,
  imports: [
    FormsModule,
    UiModule
  ],
  standalone: true
})
export class NostrAccountDialog {
  pubk!: string;

  constructor(public dialogRef: DialogRef<NostrAccount>, @Inject(DIALOG_DATA) public data:NostrAccount) {}
}

export interface ChatWrapperNotification {
  level: "error" | "info",
  content: string;
}

@Component({
  selector: 'chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent implements OnInit, OnChanges  {

  @Input()
  account!: NostrAccount | null;

  @Output()
  notification: EventEmitter<ChatWrapperNotification> = new EventEmitter();
  
  selectedContactSub = new BehaviorSubject<Contact | null>(null);
  selectedContact$ = this.selectedContactSub.asObservable();

  textInput?:string;

  // current account (sender)
  currAcctSub = new BehaviorSubject<NostrAccount | null>(null);
  currAcct$ = this.currAcctSub.asObservable();

  // this should be sorted by created_at by asc
  currentMsgs$?: Observable<Message[]>;

  // oldest timestamp in unix timestamp
  oldestTimestamp?: number;

  currentContacts$?: Observable<Contact[] | null>;

  numberOfMessagesPerLoad = 5;

  constructor( readonly chatSvc: ChatService, private readonly dialog: Dialog){

 
  }
  ngOnChanges(changes: SimpleChanges): void {
    if('account' in changes){
      this.currAcctSub.next(changes["account"].currentValue)
    }
  }
  ngOnInit(): void {
    this.currentContacts$ = this.chatSvc.currentAcctContacts$.pipe(
      map(pubks=> {
        if(!pubks){
          return null;
        }
        return pubks.map(pubk => ({
          pubk
        }))
      })
    );

    this.currAcct$
    .subscribe({
      next: acct => {
        this.chatSvc.updateCurrentAcct(acct?.sk!, acct?.pk!);
      },
      error: err => console.error(err)
    });

    // if new contact selected, load first x messages
    this.selectedContact$.subscribe(c => {
      const acct = this.currAcctSub.getValue();
      if(!acct){
        this.notification.next({
          level: "error",
          content: "No account set"
        })
        return;
      }
      if(!c){
        this.notification.next({
          level: "error",
          content: "No contact set"
        })
        return;
      }
      const { sk, pk } = acct;
      this.chatSvc.loadMessagesUntil(sk, pk, c.pubk, Math.round(Date.now() / 1000), this.numberOfMessagesPerLoad)
    })

    this.currentMsgs$ = combineLatest([
      this.selectedContact$,
      this.chatSvc.indexedMsgs$
    ]).pipe(
      map(([selectedContact, allMsgs]) => {
        if(!allMsgs) return [];
        if(selectedContact!.pubk in allMsgs ){
          const msgs = allMsgs[selectedContact!.pubk];
          // latest first
          msgs.sort((msg1, msg2) => msg2.createdAt - msg1.createdAt)

          // oldest is the last
          this.oldestTimestamp = msgs[msgs.length-1].createdAt;
          return msgs;
        } else {
          return [];
        }

      })
    )

    
  }

  send() {
    if(!this.textInput){
      return;
    }

    const currAcct = this.currAcctSub.getValue();
    if(!currAcct){
      return;
    }
    const selContact = this.selectedContactSub.getValue();
    if(!selContact){
      return;
    }

    const { sk, pk } = currAcct;
    if(!sk || !pk){
      return;
    }
    const pk2 = selContact.pubk;

    this.chatSvc.sendDirectMessage(sk, pk, pk2, this.textInput);

    this.textInput = ""
  }

  loadEarlierMessages(){
    const acct = this.currAcctSub.getValue();
      if(!acct){
        this.notification.next({
          level: "error",
          content: "No account set"
        })
        return;
      }
      const selContact = this.selectedContactSub.getValue();

      if(!selContact){
        this.notification.next({
          level: "error",
          content: "No contact set"
        })
        return;
      }
      const { sk, pk } = acct;

      if(!this.oldestTimestamp){
        this.notification.next({
          level: "info",
          content: "No more messages"
        })
        return;
      }
      this.chatSvc.loadMessagesUntil(sk, pk, selContact.pubk, this.oldestTimestamp, this.numberOfMessagesPerLoad)
  }

  openAddContactDialog() {

    const dialogRef = this.dialog.open<string>(ContactPubkeyDialog, {
      maxWidth: '50vw',
    });

    dialogRef.closed.subscribe(result => {
      const currAcct = this.currAcctSub.getValue();

      if(!currAcct || !result){
        return;
      }

      const { pk } = currAcct;
      this.chatSvc.addContact(pk, result);
    });
   
  }

  openCurrentNostrAcctDialog() {
    const dialogRef = this.dialog.open<NostrAccount>(NostrAccountDialog, {
      maxWidth: '50vw',
      data: this.currAcctSub.getValue() || {pk:null, sk: null}
    });

    dialogRef.closed.subscribe(result => {
    })
  }

  selectContact(c: Contact) {
    this.selectedContactSub.next(c);
  }

  pubks2contact(pubks: string[]): Contact[] {
    return pubks.map(pubk=> ({
      pubk
    }));
  }

  msgTrackBy(idx:number, msg: Message) {
    return msg.id
  }
}
