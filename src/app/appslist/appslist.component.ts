import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import APPSINFO from "apps.json"

interface AppInfo {
  name: string;
  description: string;
  url: string;
  categories: string[];
}


@Component({
  selector: 'app-appinfo-card',
  template: `
    <div class="rounded-lg border p-4 cursor-pointer" (click)="clickCard()">
      <h5 class="mb-2 text-xl font-medium">
          {{appInfo.name}}
      </h5>
      <p>{{appInfo.description}}</p>
      
    </div>
  `,
  styles:[`

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInfoCard {
  @Input()
  appInfo!: AppInfo;

  clickCard() {
    window.open(this.appInfo.url)
  }
}

@Component({
  selector: 'app-appslist',
  template: `
    <div class="container mx-auto p-4">
      <div class="flex flex-row gap-4">
        <button *ngFor="let cat of categories" app-button="secondery">{{cat}}</button>

      </div>
      <div class="mt-4 grid grid-cols-4 gap-4">
        <app-appinfo-card *ngFor="let app of apps" [appInfo]="app"></app-appinfo-card>
      </div>

      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppsListComponent {
  apps: AppInfo[];
  categories: string[];
  constructor() {
    this.apps = APPSINFO.apps;

    const categories = new Set();
    APPSINFO.apps
    .flatMap(app => app.categories || [])
    .forEach(cat => {
      categories.add(cat);
    });

    this.categories = [...categories] as string[];
    


  }

}
