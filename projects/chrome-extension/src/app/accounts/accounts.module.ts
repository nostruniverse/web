import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';
import { UiModule } from 'shared';
import { AccountsRoutingModule } from './accounts-routing.module';
import { NostrAcctMgmtModule } from 'nostr-acct-mgmt';



@NgModule({
  declarations: [
    AccountsPageComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    AccountsRoutingModule,
    NostrAcctMgmtModule
  ]
  
})
export class AccountsModule { }
