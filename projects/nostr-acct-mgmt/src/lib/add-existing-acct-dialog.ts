import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Account } from "./account";
import { NotificationService } from "ui";

@Component({
    selector: 'add-existing-acct-dialog',
    template:`
    <h1 mat-dialog-title>Adding your existing Nostr account</h1>
<div mat-dialog-content>
  <mat-form-field>
    <mat-label>Public Key</mat-label>
    <input matInput [(ngModel)]="existingAcct.pubk">
  </mat-form-field>

  <mat-form-field>
    <mat-label>Private Key</mat-label>
    <input matInput [(ngModel)]="existingAcct.prvk">
  </mat-form-field>
</div>
<div mat-dialog-actions align="end">
  <button mat-button color="warning" (click)="onNoClick()">Cancel</button>
  <button mat-button cdkFocusInitial (click)="onAddClick()">Add</button>
</div>
`,
  })
  export class AddExistingAcctDialog {

    existingAcct: Account = {
        pubk: "",
        createdAt: Date.now()
    };

    constructor(
      public dialogRef: MatDialogRef<AddExistingAcctDialog>,
      private notification: NotificationService
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    onAddClick(): void {
        if(!this.existingAcct.pubk){
            this.notification.error("Public key is required!")
            return;
        }

        this.dialogRef.close(this.existingAcct);
    }
  }