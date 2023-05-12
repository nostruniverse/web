import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account, AcctMgmtService } from './acct-mgmt.service';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';


@Component({
  selector: 'app-account-card',
  template: `
  <div 
    class="rounded-lg border p-4 cursor-pointer" 
    (click)="select.next()"
    [ngClass]="{
       'border-red-500': isSelected
     }">
    
    <h5 class="mb-2 font-medium">Public key</h5>
    <p class="truncate mb-4">{{account.pubk}}</p>

    <h5 class="mb-2 font-medium">Private key</h5>
    <p class="truncate mb-4">{{account.prvk}}</p>
    <button app-button="warning" (click)="remove.next()">Remove</button>
  </div>
  `
})
export class AccountCard {
  @Input()
  account!: Account;

  @Input()
  isSelected!: boolean;

  @Output()
  remove: EventEmitter<void> = new EventEmitter();

  @Output()
  select: EventEmitter<void> = new EventEmitter();
}


@Component({
  selector: 'app-account-mgmt',
  template: `
  <div class="container mx-auto p-4">
    <div class="flex flex-row gap-4 mb-4">
      <button app-button="primary" (click)="createAccount()">New</button>
      <button app-button="primary">Add existing</button>
    </div>
   

    <ng-container *ngIf="
        { 
          acctStorage: acctMgmtSvc.accountStorage$ | async,
          selectedAcct: acctMgmtSvc.selectedAccount$ | async
        } as obs">
        <ng-container *ngIf="obs.acctStorage && obs.acctStorage.accounts.length > 0; else empty">
        <div class="grid grid-cols-4 gap-4">
          <app-account-card *ngFor="let account of obs.acctStorage.accounts" 
          [account]="account"
          [isSelected]="obs.selectedAcct?.pubk == account.pubk"
          (remove)="acctMgmtSvc.removeAccount(account.pubk)"
          (select)="acctMgmtSvc.selectAccount(account)"
          ></app-account-card>
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
})
export class AccountMgmtComponent {
    constructor(readonly acctMgmtSvc: AcctMgmtService ){
    }

    trackAcct(index:number, acct:Account){
      return acct ? acct.pubk : undefined;
    }

    createAccount(){
      const prvk = generatePrivateKey();
      const pubk = getPublicKey(prvk);
      const account: Account = {
        prvk,
        pubk,
        createdAt: Date.now()
      };
      this.acctMgmtSvc.addAccount(account);
    }

    removeAccount(pubk: string){
      this.acctMgmtSvc.removeAccount(pubk);
    }
}
