import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, map, switchMap, tap, throwError } from "rxjs";
import { NotificationService } from "./notification.service";
import { EventTemplate, finishEvent } from "nostr-tools"
import { NostrService } from "./nostr.service";
import { Apollo } from "apollo-angular";
import { GetMeGQL, SignInByNostrGQL, User } from "src/generated/graphql";
import { Router } from "@angular/router";



@Injectable({
    providedIn: "root"
})
export class AuthService {

    userSubject = new BehaviorSubject<any>(null);
    user$ = this.userSubject.asObservable();

    constructor(private readonly notification: NotificationService, 
        private readonly nostrService: NostrService, 
        private readonly apollo: Apollo,
        private readonly signInByNostrGql: SignInByNostrGQL,
        private readonly getMeGql: GetMeGQL,
        private readonly router: Router
        ){
            this.signInIfLocalStorageHasToken()
    }


    signInByNostr(request?: {
        pk?: string,
        sk?: string
    }): Observable<User | null> {
        const { pk, sk } = request || {};
        if(!window.nostr && !(pk && sk)){
             return throwError(() => 'No nostr account found')
        }

        let event: EventTemplate<1> = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags:[],
            content: ""
        };
        return from(this.nostrService.signEvent(event, sk))
        .pipe(
            switchMap(signedEvent => {
                const str = JSON.stringify(signedEvent);
                return this.signInByNostrGql.fetch({
                    signedEvent:str
                })
            }),
            map(res => res.data.signInByNostr),
            switchMap(res => {
                return this.updateTokens(res!.bearerToken!, res!.refreshToken!, res!.expiredAt!);
            }),
        )

    }

    signInIfLocalStorageHasToken() {
        const bearerToken = localStorage.getItem('bearer_token');
        if (bearerToken) {
          this.fetchMe().subscribe({
            next: (user) => {
              if (user) {
                this.notification.info(`Welcome back, ${user.name}`);
              }
            },
            error: (err) => {
              this.notification.error(err);
              this.router.navigate(['/', { onSameUrlNavigation: "reload" }]);
              this.clearAuthStorage();
            },
          });
        }
      }
    
      updateTokens(
        bearerToken: string,
        refreshToken: string,
        expiredAt: string,
      ): Observable<User | null> {
        localStorage.setItem('bearer_token', bearerToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('expired_at', `${expiredAt}`);
    
        return this.fetchMe();
      }
    
      fetchMe() {
        return this.getMeGql.fetch().pipe(
          map((res) => res.data.getUser?.user || null),
          tap((user) => {
            this.userSubject.next(user);
          }),
        );
      }
    
      clearAuthStorage() {
        localStorage.removeItem('bearer_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expired_at');
      }
    
      signOut() {
        this.clearAuthStorage();
        this.userSubject.next(null);
        this.router.navigate(["/"], { onSameUrlNavigation: "reload" })
      }

}