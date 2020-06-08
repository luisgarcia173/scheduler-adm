import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { DashboardService } from 'src/app/modules/dashboard/dashboard.service';
import { JobsComponent } from 'src/app/modules/jobs/jobs.component';
import { MonitorComponent } from 'src/app/modules/monitor/monitor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    MonitorComponent,
    JobsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [
    DashboardService
  ]
})
export class DefaultModule { }
