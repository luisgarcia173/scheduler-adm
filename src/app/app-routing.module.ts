import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { JobsComponent } from './modules/jobs/jobs.component';
import { MonitorComponent } from './modules/monitor/monitor.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  data: {
    breadcrumb: {
      label: 'Home',
      info: 'home'
    }
  },
  children: [
    {
      path: '',
      component: DashboardComponent,
      data: { breadcrumb: 'Dashboard' }
    },
    {
      path: 'monitor',
      component: MonitorComponent,
      data: { breadcrumb: 'Monitor' }
    },
    {
      path: 'jobs',
      component: JobsComponent,
      data: { breadcrumb: 'Jobs' }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
