import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWrapperComponent } from './chat-wrapper/chat-wrapper.component';
import { ChatService } from './chat.service';
import { ContactsListItemComponent } from './contacts-list-item/contacts-list-item.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatWrapperComponent,
    ContactsListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    ChatService
  ],
  exports: [
    ChatWrapperComponent
  ]
})
export class ChatModule { }
