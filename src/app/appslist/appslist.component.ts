import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import APPSINFO from "apps.json"
import { BehaviorSubject, Observable, debounceTime, map } from 'rxjs';

interface AppInfo {
  name: string;
  author?: string;
  description?: string;
  url?: string;
  screenshotUrls?: string[];
  iconUrl?: string;
  categories: string[];
}

interface AppInfoFilter {
  query?: string;
  categories?: string[]
}

@Component({
  selector: 'app-appinfo-card',
  template: `
    <div class="rounded-lg border p-4 cursor-pointer" (click)="clickCard()">
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-4">
          <img class="h-12 w-12 rounded-md" [src]="appInfo.iconUrl">
          <div>
            <h5 class="mb-2 text-xl font-medium mb-0">
                {{appInfo.name}}
            </h5>
            <p *ngIf="appInfo.author">{{appInfo.author}}</p>
          </div>
          
        </div>
        <p>{{appInfo.description}}</p>

      </div>
      
      
      
    </div>
  `,
  styles: [`

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

    <div class="relative mb-4">
      <input #q (keyup)="queryChange(q.value)" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-black" placeholder="Search">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 17l5-5m0 0l-5-5m5 5H4"></path>
        </svg>
      </div>
    </div>
      <div class="flex flex-row gap-4 flex-wrap">
        <button *ngFor="let cat of categories" 
        app-button="secondery" 
        [app-selected]="catSelect[cat]"
        (click)="toggleCategory(cat)"
        >{{cat}}</button>

      </div>
      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <app-appinfo-card *ngFor="let app of filteredApps$ | async" [appInfo]="app"></app-appinfo-card>
      </div>

      
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppsListComponent implements OnInit {
  apps: AppInfo[];
  categories: string[];
  catSelect:Record<string, boolean>;

  filterSub = new BehaviorSubject<AppInfoFilter | null>(null);
  filter$ = this.filterSub.asObservable();

  querySub = new BehaviorSubject<string | null>(null);
  query$ = this.querySub.asObservable();

  filteredApps$!: Observable<AppInfo[]>;
  constructor() {
    this.apps = APPSINFO.apps;

    const categories = new Set();
    APPSINFO.apps
      .flatMap(app => app.categories || [])
      .forEach(cat => {
        categories.add(cat);
      });

    this.categories = [...categories] as string[];
    this.catSelect = {};
    this.categories.forEach(c => this.catSelect[c] = false);


  }
  ngOnInit(): void {
    this.query$.pipe(
      debounceTime(500)
    ).subscribe({
      next: (q) => {
        let filter = this.filterSub.getValue();
        if (!filter) {
          filter = {}
        }
        filter!.query = q || ""
        this.filterSub.next(filter)
      }
    })

    this.filteredApps$ = this.filter$.pipe(map(filter => {
      return this.filterAppInfos(this.apps, filter)
    }));
  }

  filterAppInfos(appInfos: AppInfo[], filter: AppInfoFilter | null): AppInfo[] {
    if (!filter) {
      return appInfos;
    }
    return appInfos.filter(appInfo => {
      const { query, categories } = filter;
      if (query) {
        const lq = query.toLowerCase();
        if (!appInfo.name?.toLowerCase().includes(lq) && !appInfo.description?.toLowerCase().includes(lq)) {
          return false;
        }
      }

      if (categories) {

        for (const c of categories) {
          if (!appInfo.categories.includes(c)) {
            return false;
          }
        }
      }

      return true;
    })
  }

  toggleCategory(c: string) {
    this.catSelect[c] = !this.catSelect[c]
    let filter = this.filterSub.getValue();
    if (!filter) {
      filter = {}
    }
    if (!filter.categories) {
      filter.categories = [c];
    } else {
      const res = filter.categories.find(i => i == c);
      if (res) {
        filter.categories = filter.categories.filter(i => i != c);
      } else {
        filter.categories.push(c);
      }
    }
    this.filterSub.next(filter)
  }

  queryChange(q: string) {
    this.querySub.next(q);
  }



}
