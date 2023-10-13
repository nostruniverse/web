import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, map, switchMap } from 'rxjs';
import { NostrChatService } from '../../nostr-chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnInit {
  sidenavOpen = true;


  @Output()
  notification: EventEmitter<Notification> = new EventEmitter();

  constructor(
    private readonly dialog: MatDialog,
    readonly chatSvc: NostrChatService,
  ) {}
  ngOnInit(): void {
    
  }

  openCreateChatroomDialog() {
    // this.dialog
    //   .open(CreateChatroomDialog)
    //   .afterClosed()
    //   .pipe(
    //     filter((res) => !!res),
    //     switchMap((userId) => {
    //       return this.createChatroom.mutate({
    //         request: { memberIds: [userId] },
    //       });
    //     }),
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       this.queryRef.refetch();
    //     },
    //     error: (err) => this.notification.error(`${err}`),
    //   });
  }
}

// @Component({
//   selector: 'create-chatroom-dialog',
//   template: `
//     <h2 mat-dialog-title>Chat with</h2>
//     <mat-dialog-content>
//       <mat-form-field>
//         <mat-label>User ID</mat-label>
//         <input matInput type="text" [(ngModel)]="input" />
//         <button
//           *ngIf="input"
//           matSuffix
//           mat-icon-button
//           aria-label="Clear"
//           (click)="input = ''"
//         >
//           <mat-icon>close</mat-icon>
//         </button>
//       </mat-form-field>
//     </mat-dialog-content>
//     <mat-dialog-actions align="end">
//       <button mat-button mat-dialog-close>Cancel</button>
//       <button mat-button cdkFocusInitial [mat-dialog-close]="input">
//         Create
//       </button>
//     </mat-dialog-actions>
//   `,
// })
// export class CreateChatroomDialog {
//   input!: string | null;
// }
