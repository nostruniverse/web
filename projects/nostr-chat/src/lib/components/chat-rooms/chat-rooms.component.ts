import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../contact';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss'],
})
export class ChatRoomsComponent {
  @Input()
  contacts!: Contact[];

  selectedContact: Contact | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  selectRoom(room: any) {
    this.selectedContact = room;
    this.router.navigate(['r', room.id], { relativeTo: this.route });
  }
}
