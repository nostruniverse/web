import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NostrworldSyncRoutingModule } from './nostrworld-sync-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    NostrworldSyncRoutingModule,
    SharedModule
  ]
})
export class NostrworldSyncModule { }
