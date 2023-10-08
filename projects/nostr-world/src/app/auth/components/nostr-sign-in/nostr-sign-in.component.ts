import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-nostr-sign-in',
  templateUrl: './nostr-sign-in.component.html',
  styleUrls: ['./nostr-sign-in.component.scss']
})
export class NostrSignInComponent {
  constructor(
    private readonly authService: AuthService, 
    private readonly router: Router,
    private readonly notification: NotificationService){

  }

  signIn(){
    this.authService.signInByNostr().subscribe({
      next: () => {
        this.router.navigate([""])
      },
      error: err => this.notification.error(err)
    });
  }

}
