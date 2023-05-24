import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-popup',
  template: `
    <div class="fixed top-0 left-0 w-full h-full flex flex-col items-stretch justify-stretch bg-black bg-opacity-60 z-20">
        <div class="flex flex-row-reverse items-center p-4 bg-black bg-opacity-70 text-white">
            <button (click)="closePopup()">Close</button>
        </div>
        <div class="flex-1">
            <ng-content></ng-content>
        </div>
    </div>
  `,
})
export class UiPopupComponent {
  @Output()
  close: EventEmitter<void> = new EventEmitter();

  closePopup() {
    this.close.next()
  }
  
}