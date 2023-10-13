import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppInfoCard, AppsListComponent } from './appslist/appslist.component';
import { CHAT_SERVICE_CONFIG, ChatServiceConfig, NostrChatModule } from 'nostr-chat';
import { UiModule } from 'shared';
import { ChatPageComponent } from './chat-page.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AppsListComponent,
    AppInfoCard,
    ChatPageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NostrChatModule,
    UiModule
  ],
  providers: [
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
