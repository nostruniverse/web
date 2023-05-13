import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Contact } from '../contact';
import { ChatService } from '../chat.service';
import { BehaviorSubject, Observable, combineLatest, combineLatestAll, combineLatestWith, map, of } from 'rxjs';
import { Message } from '../message';


interface NostrAccount {
  sk: string;
  pk: string;
}


@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent implements OnInit, OnChanges  {

  @Input()
  account?: NostrAccount;
  
  selectedContact: Contact | null;
  selectedContactSub = new BehaviorSubject<Contact | null>(null);
  selectedContact$ = this.selectedContactSub.asObservable();

  contactInput?: string
  textInput?:string;

  // current account (sender)
  currAcctSub = new BehaviorSubject<NostrAccount | null>(null);
  currAcct$ = this.currAcctSub.asObservable();

  // this should be sorted by created_at by asc
  currentMsgs?: Observable<Message[]>;
  currentContacts?: Observable<Contact[]>;


  constructor( readonly chatSvc: ChatService){

    this.selectedContact = null;
 
  }
  ngOnChanges(changes: SimpleChanges): void {
    if('account' in changes){
      this.currAcctSub.next(changes["account"].currentValue)
    }
  }
  ngOnInit(): void {
    this.currentContacts = this.chatSvc.currentAcctContacts$.pipe(
      map(pubks=> {
        if(!pubks){
          return [];
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

    this.currentMsgs = combineLatest([
      this.selectedContact$,
      this.chatSvc.indexedMsgs$
    ]).pipe(
      map(([selectedContact, allMsgs]) => {
        if(!allMsgs) return [];
        if(selectedContact!.pubk in allMsgs ){
          const msgs = allMsgs[selectedContact!.pubk];
          msgs.sort((msg1, msg2) => msg2.createdAt - msg1.createdAt)
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

    if(!this.selectedContact){
      return;
    }

    const { sk, pk } = currAcct;
    if(!sk || !pk){
      return;
    }
    const pk2 = this.selectedContact.pubk;

    this.chatSvc.sendDirectMessage(sk, pk, pk2, this.textInput);

    this.textInput = ""
  }

  addContact() {
    const currAcct = this.currAcctSub.getValue();

    if(!this.contactInput || !currAcct){
      return;
    }

    const { pk } = currAcct;
    this.chatSvc.addContact(pk, this.contactInput);
    this.contactInput = "";
  }

  selectContact(c: Contact) {
    this.selectedContact = c; 
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
