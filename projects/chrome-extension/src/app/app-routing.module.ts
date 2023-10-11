import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getRouteMatcherByExtensionMode } from './routeMatchers';
import { ConfigService, ExtensionMode } from './core/services/config.service';
import { ModeChooserComponent } from './core/components/mode-chooser/mode-chooser.component';
import { map } from 'rxjs/operators';

const routes: Routes = [
  {
    path: "apps",
    loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: "",
    component: ModeChooserComponent,
    canMatch: [
      () => inject(ConfigService).getExtensionMode().pipe(map(res => res == null))
    ]
  },
  {
    path:"",
    loadChildren: () => import('./browser-sync/browser-sync.module').then(m => m.BrowserSyncModule) ,
    canMatch: [
      () => inject(ConfigService).getExtensionMode().pipe(map(res => res == ExtensionMode.BrowserSync))
    ]
  },
  {
    path:"",
    loadChildren: () => import('./nostrworld-sync/nostrworld-sync.module').then(m => m.NostrworldSyncModule),
    canMatch: [
      () => inject(ConfigService).getExtensionMode().pipe(map(res => res == ExtensionMode.NostrWorldSync))
    ]
  },
  {
    path:"",
    loadChildren: () => import('./local/local.module').then(m => m.LocalModule),
    canMatch: [
      () => inject(ConfigService).getExtensionMode().pipe(map(res => res == ExtensionMode.Local))
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
