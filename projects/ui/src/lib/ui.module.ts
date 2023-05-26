import { NgModule } from '@angular/core';
import { Button } from './directives/button';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { EditableTextComponent } from './components/editable-text.component';
import { BriefTextComponent } from './components/brief-text.component';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { Edit, Check } from 'angular-feather/icons';


@NgModule({
  declarations: [
    Button,
    EditableTextComponent,
    BriefTextComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    FeatherModule.pick({Edit, Check})
  ],
  exports: [
    Button,
    EditableTextComponent,
    BriefTextComponent
  ]
})
export class UiModule { }
