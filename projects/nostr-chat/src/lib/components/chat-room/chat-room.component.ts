import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Contact } from '../../contact';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomComponent {
  
  @Input()
  contact!: Contact;


  @Input()
  selected!: boolean;

  @Output()
  select: EventEmitter<Contact> = new EventEmitter();
}
