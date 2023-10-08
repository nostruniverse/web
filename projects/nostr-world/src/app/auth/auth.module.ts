import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MaterialModule } from '../material.module';
import { EmailSignInComponent } from './components/email-sign-in/email-sign-in.component';
import { NostrSignInComponent } from './components/nostr-sign-in/nostr-sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SignInComponent,
    EmailSignInComponent,
    NostrSignInComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
