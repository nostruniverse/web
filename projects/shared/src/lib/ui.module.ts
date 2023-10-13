import { NgModule } from '@angular/core';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { EditableTextComponent } from './components/editable-text.component';
import { BriefTextComponent } from './components/brief-text.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    EditableTextComponent,
    BriefTextComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    MaterialModule
  ],
  exports: [
    EditableTextComponent,
    BriefTextComponent,
    MaterialModule
  ]
})
export class UiModule { }
