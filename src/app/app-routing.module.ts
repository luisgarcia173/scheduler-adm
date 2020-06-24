import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { JobsComponent } from './modules/jobs/jobs.component';
import { LoginComponent } from './modules/login/login.component';
import { MonitorComponent } from './modules/monitor/monitor.component';
import { FaqComponent } from './shared/components/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'USER'],
        redirectTo: '/login'
      },
      breadcrumb: {
        label: 'Home',
        info: 'home'
      }
    },
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN', 'USER'],
            redirectTo: '/login'
          },
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'monitor',
        component: MonitorComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN', 'USER'],
            redirectTo: '/login'
          },
          breadcrumb: 'Monitor'
        }
      },
      {
        path: 'jobs',
        component: JobsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN', 'USER'],
            redirectTo: '/login'
          },
          breadcrumb: 'Jobs'
        }
      },
      {
        path: 'faq',
        component: FaqComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN', 'USER'],
            redirectTo: '/login'
          },
          breadcrumb: 'FAQ'
        }
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
