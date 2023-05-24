import { Component, OnInit } from '@angular/core';
import { NostrAcctMgmtService } from 'nostr-acct-mgmt';
import { NostrAccount } from 'nostr-chat';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  template: `
  <div style="height: calc(100% - 64px);">
    <chat-wrapper [account]="currentAccount$ | async"></chat-wrapper>
  </div>
    
   `
})
export class ChatPageComponent implements OnInit {

  currentAccount$!: Observable<NostrAccount | null>

  constructor(readonly nostrAcctMgmt: NostrAcctMgmtService){

  }
    ngOnInit(): void {
        this.currentAccount$ = this.nostrAcctMgmt.selectedAccount$.pipe(map(
            acct => ( acct? { pk:acct.pubk, sk: acct.prvk! } : null )
        ));
    }

  


}
