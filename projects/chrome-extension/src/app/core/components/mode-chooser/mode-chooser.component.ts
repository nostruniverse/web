import { Component } from '@angular/core';
import { ConfigService, ExtensionMode } from '../../services/config.service';
import { NotificationService } from 'shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mode-chooser',
  templateUrl: './mode-chooser.component.html',
  styleUrls: ['./mode-chooser.component.scss']
})
export class ModeChooserComponent {
  ExtensionMode = ExtensionMode
  
  constructor(private readonly configService: ConfigService, 
    private readonly notification: NotificationService,
    private readonly router: Router){}

  chooseMode(mode: ExtensionMode) {
    this.configService.setExtensionMode(mode)
    .subscribe({
      next: () => {
        this.router.navigate(["/"], {onSameUrlNavigation: "reload"})
      },
      error: err => this.notification.error(err)
    })
  }
}
