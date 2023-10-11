import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'ui-brief-text',
  template: `
    <button
    matTooltip="Click to copy" 
    class="rounded-full border px-4 py-1 hover:bg-gray-200" 
    (click)="copy()">
        <p class="truncate" style="width: 128px" >{{text}}</p>
    </button>
  `,
})
export class BriefTextComponent {
  @Input()
  text!: string

  @Input()
  copyOnClick = true;

  constructor(private clipboard: Clipboard, private readonly notification: NotificationService) {

  }
  copy() {
    if(this.copyOnClick){
        this.clipboard.copy(this.text);
        this.notification.info("Copied to the clipboard")
    }
  }
}
