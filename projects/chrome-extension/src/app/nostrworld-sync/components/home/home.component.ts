import { Component } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private readonly configService: ConfigService, private readonly router: Router) {

  }

  exitMode() {
    this.configService.setExtensionMode(null)
    .subscribe({
      next: _ => this.router.navigate([], {onSameUrlNavigation:"reload"})
    });
  }
}
