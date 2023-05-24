import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Account } from "./account";

@Component({
    selector: 'nw-acct-card',
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