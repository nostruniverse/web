import { Component } from '@angular/core';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { Account } from './account';
import { NostrAcctMgmtService } from './nostr-acct-mgmt.service';
import { from } from 'rxjs';

@Component({
  selector: 'nw-nostr-acct-mgmt',
  template: `
  <div class="container mx-auto p-4">
    <p *ngIf="isInExtension">Running in extension</p>
    <p *ngIf="isExtensionRunning && !isInExtension">Extension is running</p>
    <p *ngIf="!isExtensionRunning && !isInExtension">Extension is not running</p>
    <div class="flex flex-row gap-4 mb-4">
      <button ui-button="primary" (click)="createAccount()">New</button>
      <button ui-button="primary">Add existing</button>
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
  <div class="bg-blue-500 text-white font-semibold p-4 rounded-md">
  <div class="flex items-center">
    <div class="ml-3">
      <p class="text-sm"> Create account or add your exising public key!</p>
    </div>
  </div>
</div>
   
  </ng-template>
  `,
  styles: [
  ]
})
export class NostrAcctMgmtComponent {

  isExtensionRunning!: boolean;
  isInExtension: boolean;
  constructor(readonly acctMgmtSvc: NostrAcctMgmtService) {
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
    const prvk = generatePrivateKey();
    const pubk = getPublicKey(prvk);
    const account: Account = {
      prvk,
      pubk,
      createdAt: Date.now()
    };
    this.acctMgmtSvc.addAccount(account);
  }

  removeAccount(pubk: string) {
    this.acctMgmtSvc.removeAccount(pubk);
  }
}
