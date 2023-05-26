import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'ui-brief-text',
  template: `
    <button class="rounded-full border px-4" (click)="copy()">
        <p class="truncate" style="width: 64px" >{{text}}</p>
    </button>
  `,
})
export class BriefTextComponent {
  @Input()
  text!: string

  @Input()
  copyOnClick = true;

  constructor(private clipboard: Clipboard) {

  }
  copy() {
    if(this.copyOnClick){
        this.clipboard.copy(this.text);
    }
  }
}
