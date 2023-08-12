import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Account } from "./account";

@Component({
    selector: 'nw-acct-card',
    template: `
    <div 
      class="rounded-lg border p-4 flex flex-col gap-2 items-stretch" 
      [ngClass]="{
         'border-red-500': isSelected
       }">
      
       <div class="flex flex-row justify-between items-center">
          <h5 class="font-medium text-sm">Public key</h5>
          <ui-brief-text [text]="account.pubk"></ui-brief-text>
       </div>
      
       <div class="flex flex-row justify-between items-center">
          <h5 class="font-medium text-sm">Private key</h5>
          <ui-brief-text [text]="account.prvk!"></ui-brief-text>
       </div>

       <!-- <div class="flex flex-row justify-between items-center">
          <h5 class="font-medium text-sm">Internet Identifier</h5>
          <ui-editable-text [text]="account.id!"></ui-editable-text>
       </div>

       <div class="flex flex-row justify-between items-center">
          <h5 class="font-medium text-sm">Name</h5>
          <ui-editable-text [text]="account.name!"></ui-editable-text>
       </div> -->
      

      <div class="flex flex-col items-stretch gap-2 border-t">
        <button *ngIf="!isSelected" mat-flat-button color="primary" (click)="select.next()">Select</button>
        <button mat-flat-button color="warning" (click)="remove.next()">Remove</button>
      </div>
      
    </div>
    `
  })
  export class NostrAcctCard {
    @Input()
    account!: Account;
  
    @Input()
    isSelected!: boolean;
  
    @Output()
    remove: EventEmitter<void> = new EventEmitter();
  
    @Output()
    select: EventEmitter<void> = new EventEmitter();
  }