import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWrapperComponent } from './chat-wrapper/chat-wrapper.component';
import { ChatService } from './nostr-chat.service';
import { ContactsListItemComponent } from './contacts-list-item/contacts-list-item.component';
import { FormsModule } from '@angular/forms';
import { UiModule } from 'ui';
import {DialogModule} from '@angular/cdk/dialog';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from "ngx-infinite-scroll";



@NgModule({
  declarations: [
    ChatWrapperComponent,
    ContactsListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UiModule,
    DialogModule,
    ScrollingModule,
    InfiniteScrollModule
  ],
  providers: [
    ChatService
  ],
  exports: [
    ChatWrapperComponent
  ]
})
export class NostrChatModule { }
