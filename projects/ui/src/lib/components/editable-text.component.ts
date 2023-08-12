import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-editable-text',
  template: `
  <div *ngIf="!editing; else editingState" class="flex flex-row gap-2">
    <p class="">{{text}}</p>
    <button (click)="startEditing()" title="edit">
       Edit
    </button>
  </div>
  <ng-template #editingState>
    <div class="flex flex-row gap-2">
        <input type="text" class="rounded-full border px-4 py-1">
        <button (click)="finishEditing()">Done</button>
    </div>
    
  </ng-template>
  `,
})
export class EditableTextComponent {
  @Input()
  editable: boolean = true;

  @Input()
  text!: string;

  @Output()
  textUpdate: EventEmitter<string> = new EventEmitter();

  editing = false;
  editingText: string | null = null;

  startEditing() {
    this.editingText = this.text;
    this.editing = true;
  }

  finishEditing() {
    if(!this.editingText){
        this.editing = false;
    } else {
        this.textUpdate.next(this.editingText)
        this.editing = false;

    }
  }
}
