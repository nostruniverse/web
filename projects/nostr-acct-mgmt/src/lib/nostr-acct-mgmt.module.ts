import { NgModule } from '@angular/core';
import { NostrAcctMgmtComponent } from './nostr-acct-mgmt.component';
import { NostrAcctCard } from './nostr-acct-card.component';
import { CommonModule } from '@angular/common';
import { NostrAcctMgmtService } from './nostr-acct-mgmt.service';



@NgModule({
  declarations: [
    NostrAcctMgmtComponent,
    NostrAcctCard
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NostrAcctMgmtComponent
  ]
})
export class NostrAcctMgmtModule { }
