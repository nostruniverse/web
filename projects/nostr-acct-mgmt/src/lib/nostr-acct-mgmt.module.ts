import { NgModule } from '@angular/core';
import { NostrAcctMgmtComponent } from './nostr-acct-mgmt.component';
import { NostrAcctCard } from './nostr-acct-card.component';
import { CommonModule } from '@angular/common';
import { UiModule } from 'shared';
import { AddExistingAcctDialog } from './add-existing-acct-dialog';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NostrAcctMgmtComponent,
    NostrAcctCard,
    AddExistingAcctDialog
  ],
  imports: [
    CommonModule,
    UiModule,
    FormsModule
  ],
  exports: [
    NostrAcctMgmtComponent
  ]
})
export class NostrAcctMgmtModule { }
