import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Message } from '../../message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    const data = changes['data'];
    if (data) {
      if (data.currentValue.messages.length > 0) {
        const latestMsgDate =
          data.currentValue.messages[data.currentValue.messages.length - 1]
            .createdAt;

        if (latestMsgDate != this.prevLatestMsgDate) {
          this.prevLatestMsgDate = latestMsgDate;
          setTimeout(() => {
            this.scrollToEnd();
          }, 100);
        }
      }
    }
  }
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  @Input()
  data!: {
    messages: Message[];
    meId: string;
  };

  prevLatestMsgDate = null;

  scrollToEnd() {
    this.viewport.scrollTo({ bottom: 0, behavior: 'smooth' });
  }
}
