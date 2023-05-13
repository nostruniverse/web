import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ChatService } from '../chat.service';
import { Account, AcctMgmtService } from 'src/app/acct-mgmt/acct-mgmt.service';
import { BehaviorSubject, Observable, combineLatest, combineLatestAll, combineLatestWith, map, of } from 'rxjs';
import { Message } from '../message';




@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent implements OnInit {

  selectedContact: Contact | null;
  selectedContactSub = new BehaviorSubject<Contact | null>(null);
  selectedContact$ = this.selectedContactSub.asObservable();

  contactInput?: string
  textInput?:string;

  // current account (sender)
  currentAccount?: Account | null;

  // this should be sorted by created_at by asc
  currentMsgs?: Observable<Message[]>;
  currentContacts?: Observable<Contact[]>;

  constructor( readonly chatSvc: ChatService, private readonly acctMgmt: AcctMgmtService){

    this.selectedContact = null;
 
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

    this.acctMgmt.selectedAccount$
    .subscribe({
      next: acct => {
        this.currentAccount = acct;
        this.chatSvc.updateCurrentAcct(acct?.prvk!, acct?.pubk!);
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

    if(!this.currentAccount){
      return;
    }

    if(!this.selectedContact){
      return;
    }

    const { prvk, pubk } = this.currentAccount;
    if(!prvk){
      return;
    }
    const pk2 = this.selectedContact.pubk;

    this.chatSvc.sendDirectMessage(prvk, pubk, pk2, this.textInput);

    this.textInput = ""
  }

  addContact() {
    if(!this.contactInput || !this.currentAccount){
      return;
    }

    const { pubk } = this.currentAccount;
    this.chatSvc.addContact(pubk, this.contactInput);
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
