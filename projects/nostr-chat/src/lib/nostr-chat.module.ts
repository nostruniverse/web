import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiModule } from 'shared';
import {DialogModule} from '@angular/cdk/dialog';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MessageComponent } from './components/message/message.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatRoomsComponent } from './components/chat-rooms/chat-rooms.component';
import { RouterModule } from '@angular/router';
import { NostrChatService } from './nostr-chat.service';



@NgModule({
  declarations: [
    ChatWindowComponent,
    ChatComponent,
    MessagesComponent,
    MessageComponent,
    ChatRoomComponent,
    ChatRoomsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    UiModule,
    DialogModule,
    ScrollingModule,
    InfiniteScrollModule
  ],
  providers: [
    NostrChatService
  ],
  exports: [
    ChatWindowComponent,
    ChatComponent,
  ]
})
export class NostrChatModule { }
