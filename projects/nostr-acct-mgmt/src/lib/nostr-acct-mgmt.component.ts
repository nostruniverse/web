import { Component } from '@angular/core';

import { Account } from './account';
import { NostrAcctMgmtService } from './nostr-acct-mgmt.service';
import { filter, from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddExistingAcctDialog } from './add-existing-acct-dialog';

@Component({
  selector: 'nw-nostr-acct-mgmt',
  template: `
  <div class="container mx-auto p-4">
    <div class="flex flex-row gap-4 mb-4">
      <button mat-flat-button color="primary" (click)="createAccount()">New account</button>
      <button mat-stroked-button (click)="addExistingAccount()">Add existing</button>
    </div>
   

    <ng-container *ngIf="
        { 
          acctStorage: acctMgmtSvc.accountStorage$ | async,
          selectedAcct: acctMgmtSvc.selectedAccount$ | async
        } as obs">
        <ng-container *ngIf="obs.acctStorage && obs.acctStorage.accounts && obs.acctStorage.accounts.length > 0; else empty">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <nw-acct-card *ngFor="let account of obs.acctStorage.accounts" 
          [account]="account"
          [isSelected]="obs.selectedAcct?.pubk == account.pubk"
          (remove)="acctMgmtSvc.removeAccount(account.pubk)"
          (select)="acctMgmtSvc.selectAccount(account)"
          ></nw-acct-card>
          </div>

        </ng-container>
        
      
    </ng-container>
  </div>

  <ng-template #empty>
  <div class="text-gray-400  text-lg p-4 rounded-md text-center">
    Create a new Nostr account or add your exising account!
  </div>
   
  </ng-template>
  `,
  styles: [
  ]
})
export class NostrAcctMgmtComponent {

  isExtensionRunning!: boolean;
  isInExtension: boolean;
  constructor(readonly acctMgmtSvc: NostrAcctMgmtService, readonly dialog: MatDialog) {
    this.isInExtension = acctMgmtSvc.runInBrowserExtension();
    if(this.isInExtension){
      this.isExtensionRunning = true;
    } else {
      from(acctMgmtSvc.isBrowserExtensionRunning()).subscribe({
        error: (err) => {
          this.isExtensionRunning = false
        },
        next: (value) => {
          this.isExtensionRunning = true;
          // if extension is running,
          // sync existing account keys
          const storage = this.acctMgmtSvc.readAcctStorageFromLocalStorage();
          if(storage) {
            this.acctMgmtSvc.sendAcctStorageToExtension(storage);
          }

          const selectedAcct = this.acctMgmtSvc.readSelectedAcctFromLocalStorage();
          if(selectedAcct){
            this.acctMgmtSvc.sendAcctSelectedToExtension(selectedAcct);
          }

        }
      });
    }

  }



  trackAcct(index: number, acct: Account) {
    return acct ? acct.pubk : undefined;
  }

  createAccount() {
    this.acctMgmtSvc.createAccount();
  }

  addExistingAccount() {
    this.dialog.open(AddExistingAcctDialog)
    .afterClosed()
    .pipe(
      filter(res => res != null)
    )
    .subscribe(result => {
       console.log(result);
       this.acctMgmtSvc.addAccount(result);
    })
  }

  removeAccount(pubk: string) {
    this.acctMgmtSvc.removeAccount(pubk);
  }
}
