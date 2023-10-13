import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ConfigService, ExtensionMode } from './core/services/config.service';
import { ModeChooserComponent } from './core/components/mode-chooser/mode-chooser.component';
import { map, tap } from 'rxjs/operators';


const routes: Routes = [
  {
    path: "apps",
    loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: "chat",
    loadChildren: () => import("./chat/chat.module").then(m => m.ChatModule)
  },
  {
    path:"accounts",
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [
      () => {
        const router = inject(Router);
        return inject(ConfigService).getExtensionMode().pipe(
          map(res => res != null), 
          tap(hasMode => {
            if(!hasMode){
              router.navigate([""])
            }
        }))
      }
    ],
    runGuardsAndResolvers: "always",
  },
  {
    path: "",
    component: ModeChooserComponent,
    runGuardsAndResolvers: "always",
    canActivate: [
      () => {
        const router = inject(Router);
        return inject(ConfigService).getExtensionMode().pipe(
          map(res => res == null), 
          tap(notHasMode => {
            console.log(notHasMode)
            if(!notHasMode){
              router.navigate(["accounts"])
            }
        }))
      }
    ]
  }

  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
