import { NgModule } from '@angular/core';
import { ModeChooserComponent } from './components/mode-chooser/mode-chooser.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ModeChooserComponent,
    NavigationComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ModeChooserComponent,
    NavigationComponent
  ]
})
export class CoreModule { }
