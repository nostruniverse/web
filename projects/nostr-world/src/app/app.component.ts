import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatSidenav;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    
  user$ = this.authSvc.user$;

  constructor(
    protected authSvc: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
    ){

      router.events.pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && (a instanceof NavigationEnd || a instanceof NavigationSkipped))
      ).subscribe(_ => this.drawer?.close());

  }
  ngOnInit(): void {
   
  }

  signOut(){
    this.authSvc.signOut();
  }


}
