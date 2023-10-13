import { Component } from '@angular/core';
import { ConfigService } from './core/services/config.service';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  showNavigation$: Observable<boolean> = 
  
  this.configService.change$.pipe(
    filter(change => change != null && change.extensionMode !== undefined),
    map(res => res!.extensionMode),
    map(res => res != null)
  );

  constructor(private readonly configService: ConfigService, private readonly router: Router) {}

  exitMode() {
    this.configService.setExtensionMode(null)
    .subscribe({
      next: _ => this.router.navigate([""])
    });
  }

  
}
