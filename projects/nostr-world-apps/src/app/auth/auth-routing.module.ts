import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { EmailSignInComponent } from './components/email-sign-in/email-sign-in.component';
import { NostrSignInComponent } from './components/nostr-sign-in/nostr-sign-in.component';

const routes: Routes = [
  {
    path: "",
    component: SignInComponent,
    children: [
      {
        path:"email",
        component: EmailSignInComponent
      },
      {
        path:"nostr",
        component: NostrSignInComponent
      },
      {
        path:"",
        redirectTo:"email",
        pathMatch:"full"
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
