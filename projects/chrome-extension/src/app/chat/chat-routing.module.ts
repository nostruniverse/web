import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent, ChatWindowComponent, NostrChatModule } from 'nostr-chat';
import { CHAT_SERVICE_CONFIG, ChatServiceConfig } from 'nostr-chat';


const routes: Routes = [
  {
    path: '',
    component: ChatWindowComponent,
    children: [
      {
        path: 'r/:id',
        component: ChatComponent,
      },
      {
        path: '',
        component: ChatComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NostrChatModule],
  providers: [
    {
        provide: CHAT_SERVICE_CONFIG,
        useValue: {
          relayUrl: "wss://nos.lol"
        } as ChatServiceConfig
      }
  ],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
