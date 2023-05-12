import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ChatService } from '../chat.service';
import { Account, AcctMgmtService } from 'src/app/acct-mgmt/acct-mgmt.service';




@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent implements OnInit {
  contacts: Contact[] | null

  acct2contacts: Record<string, string[]>;

  selectedContact: Contact | null;

  contactInput?: string
  textInput?:string;

  // current account (sender)
  currentAccount?: Account | null;



  constructor(private readonly chatSvc: ChatService, private readonly acctMgmt: AcctMgmtService){
    this.contacts = null;
    this.acct2contacts = {};
    this.selectedContact = null;

  }
  ngOnInit(): void {
    this.acctMgmt.selectedAccount$
    .subscribe({
      next: acct => {
        this.currentAccount = acct;
        

      },
      error: err => console.error(err)
    });


    
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
    if(! (pubk in this.acct2contacts)) {
      this.acct2contacts[pubk] = [this.contactInput]
    } else {  
      this.acct2contacts[pubk].push(this.contactInput);
    }

    this.contacts = this.pubks2contact(this.acct2contacts[pubk]);

    this.contactInput = "";
  }

  pubks2contact(pubks: string[]): Contact[] {
    return pubks.map(pubk=> ({
      pubk
    }));
  }
}
