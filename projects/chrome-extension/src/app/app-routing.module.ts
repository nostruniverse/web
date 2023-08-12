import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"accounts",
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule)
  },
  {
    path:"settings",
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: "apps",
    loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path:"",
    pathMatch: "full",
    redirectTo:"/accounts"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
