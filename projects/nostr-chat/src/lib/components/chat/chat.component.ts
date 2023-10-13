import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { NostrChatService } from '../../nostr-chat.service';
import { Notification } from "../../notification";
import { Message } from '../../message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  msg!: string;

  data!: Observable<{
    messages: Message[];
    meId: string;
  }>;

  @Output()
  notification: EventEmitter<Notification> = new EventEmitter();

  chateeId!: string;
  // oldest timestamp in unix timestamp
  oldestTimestamp?: number;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly chatSvc: NostrChatService,
  ) {}
  ngOnInit(): void {
    this.chateeId = this.route.snapshot.params['id'];

    this.data = this.chatSvc.directMessages$
    .pipe(
      map((allMsgs) => {
        if(!allMsgs) return {
          meId: this.chatSvc.account!.pk,
          messages:[],
        };
        if(this.chateeId in allMsgs ){
          const msgs = allMsgs[this.chateeId];
          // latest first
          msgs.sort((msg1, msg2) => msg2.createdAt - msg1.createdAt)

          // oldest is the last
          this.oldestTimestamp = msgs[msgs.length-1].createdAt;
          return {
            meId: this.chatSvc.account!.pk,
            messages:msgs,
          };
        } else {
          return {
            meId: this.chatSvc.account!.pk,
            messages:[]
          };
        }

      })
    )
    
    
  }

  send() {
    if (!this.msg) {
      return this.notification.error('Cannot send empty message');
    }

    const currAcct = this.chatSvc.account;
    if(!currAcct){
      return;
    }
    if(!this.chateeId){
      return;
    }

    const { sk, pk } = currAcct;
    if(!sk || !pk){
      return;
    }

    this.chatSvc.sendDirectMessage(sk, pk, this.chateeId, this.msg).subscribe({
      complete: () => {
        console.log("send!")
      },
      error: err => this.notification.error(`${err}`)
    });

    this.msg = ""
  }
}
