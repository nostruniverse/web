import { Component, Directive, HostBinding } from '@angular/core';


@Directive({
  selector: '[menu-item]'
})
export class MenuItem {

  @HostBinding('class')
  className = 'text-lg font-light rounded-full hover:bg-zinc-100 py-2 px-4 cursor-pointer flex flex-row items-center';
}

@Component({
  selector: 'app-navbar',
  template: `
  <nav class="h-16 px-8 border-b border-slate-300 flex flex-row gap-4 items-center sticky top-0 left-0 right-0 z-10 bg-white">
    <span>Nostr Universe</span>
    <button menu-item routerLink="/apps">Apps</button>
    <button menu-item routerLink="/acct-mgmt">Accounts</button>
  </nav>
  `,
  providers: [
    
  ]
})
export class NavbarComponent {

}
