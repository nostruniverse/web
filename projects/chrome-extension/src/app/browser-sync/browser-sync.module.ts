import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserSyncRoutingModule } from './browser-sync-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    BrowserSyncRoutingModule,
    SharedModule
  ]
})
export class BrowserSyncModule { }
