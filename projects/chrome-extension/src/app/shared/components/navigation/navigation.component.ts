import { Component, Input, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
    @ViewChild('drawer') drawer!: MatSidenav;

    constructor(
      router: Router,
      private breakpointObserver: BreakpointObserver
      ){
  
        router.events.pipe(
          withLatestFrom(this.isHandset$),
          filter(([a, b]) => b && (a instanceof NavigationEnd || a instanceof NavigationCancel))
        ).subscribe(_ => this.drawer?.close());
  
    }
}
