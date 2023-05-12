import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../contact';

@Component({
  selector: 'app-contacts-list-item',
  templateUrl: './contacts-list-item.component.html',
  styleUrls: ['./contacts-list-item.component.scss']
})
export class ContactsListItemComponent {
  @Input()
  contact!: Contact;

  @Output()
  select: EventEmitter<void> = new EventEmitter();
}
