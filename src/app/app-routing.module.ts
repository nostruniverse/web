import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsListComponent } from './appslist/appslist.component';
import { AccountMgmtComponent } from './acct-mgmt/acct-mgmt.component';

const routes: Routes = [
  {
    path: 'apps', 
    component: AppsListComponent,
  },
  {
    path: 'acct-mgmt',
    component: AccountMgmtComponent
  },
  {
    path:"",
    redirectTo: "apps",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
