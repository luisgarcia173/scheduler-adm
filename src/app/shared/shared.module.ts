import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BreadcrumbModule } from 'xng-breadcrumb';
import { HighchartsChartModule } from 'highcharts-angular';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './widgets/area/area.component';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { ThemePickerComponent } from './widgets/theme-picker/theme-picker.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ReleaseNotesComponent } from './components/release-notes/release-notes.component';
import { SpinnerComponent } from './widgets/spinner/spinner.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from './components/alert/alert.service';
import { ServerStatusComponent } from './components/server-status/server-status.component';
import { JobsService } from './services/jobs.service';
import { FaqComponent } from './components/faq/faq.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    ThemePickerComponent,
    BreadcrumbComponent,
    ReleaseNotesComponent,
    SpinnerComponent,
    AlertComponent,
    ServerStatusComponent,
    FaqComponent,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    BreadcrumbModule,
    MatDialogModule,
    HttpClientModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    ThemePickerComponent,
    BreadcrumbComponent,
    ReleaseNotesComponent,
    SpinnerComponent,
    AlertComponent,
    ServerStatusComponent,
    FaqComponent
  ],
  providers: [
    AlertService,
    JobsService
  ]
})
export class SharedModule { }
