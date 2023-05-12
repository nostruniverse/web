import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuItem, NavbarComponent } from './navbar/navbar.component';
import { AppInfoCard, AppsListComponent } from './appslist/appslist.component';
import { AccountCard, AccountMgmtComponent } from './acct-mgmt/acct-mgmt.component';
import { AcctMgmtService } from './acct-mgmt/acct-mgmt.service';
import { AppButton } from './directives/button';
import { PopupComponent } from './popup.component';
import { ChatModule } from './chat/chat.module';
import { CHAT_SERVICE_CONFIG, ChatServiceConfig } from './chat/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AppsListComponent,
    AccountMgmtComponent,
    AppButton,
    MenuItem,
    AppInfoCard,
    AccountCard,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChatModule
  ],
  providers: [
    AcctMgmtService,
    {
      provide: CHAT_SERVICE_CONFIG,
      useValue: {
        relayUrl: "wss://nos.lol"
      } as ChatServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
