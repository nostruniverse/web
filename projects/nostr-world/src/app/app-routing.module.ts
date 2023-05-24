import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsListComponent } from './appslist/appslist.component';
import { NostrAcctMgmtModule, NostrAcctMgmtComponent } from 'nostr-acct-mgmt';
import { ChatPageComponent } from './chat-page.component';

const routes: Routes = [
  {
    path: 'apps', 
    component: AppsListComponent,
  },
  {
    path: 'acct-mgmt',
    component: NostrAcctMgmtComponent
  },
  {
    path: "chat",
    component: ChatPageComponent
  },
  {
    path:"",
    redirectTo: "apps",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NostrAcctMgmtModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
