import { NgModule } from '@angular/core';
import { NostrAcctMgmtComponent } from './nostr-acct-mgmt.component';
import { NostrAcctCard } from './nostr-acct-card.component';
import { CommonModule } from '@angular/common';
import { UiModule } from 'ui';



@NgModule({
  declarations: [
    NostrAcctMgmtComponent,
    NostrAcctCard
  ],
  imports: [
    CommonModule,
    UiModule
  ],
  exports: [
    NostrAcctMgmtComponent
  ]
})
export class NostrAcctMgmtModule { }
