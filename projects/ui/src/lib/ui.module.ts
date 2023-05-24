import { NgModule } from '@angular/core';
import { UiButton } from './directives/button';
import { UiPopupComponent } from './popup.component';



@NgModule({
  declarations: [
    UiButton,
    UiPopupComponent
  ],
  imports: [
  ],
  exports: [
    UiButton,
    UiPopupComponent
  ]
})
export class UiModule { }
