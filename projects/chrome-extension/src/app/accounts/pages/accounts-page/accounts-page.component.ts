import { Component } from '@angular/core';
import { Account, NostrAcctMgmtService } from 'nostr-acct-mgmt';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.scss']
})
export class AccountsPageComponent {

  selectedAccount$: Observable<Account | null>
  selectedIndex = 0;
  constructor(private readonly acctSvc: NostrAcctMgmtService){
    this.selectedAccount$ = this.acctSvc.selectedAccount$;
  }
}
