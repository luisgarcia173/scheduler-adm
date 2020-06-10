import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import cronstrue from 'cronstrue';
import * as moment from 'moment';
import { JobStructure, MonitorService } from './monitor.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  taskManagerColumns = [
    { columnDef: 'className', type: 'common', header: 'Job Name', cell: (row: JobStructure) => row.className },
    { columnDef: 'group', type: 'common', header: 'Group', cell: (row: JobStructure) => row.group },
    // { columnDef: 'state', type: 'common', header: 'State', cell: (row: JobStructure) => row.state },
    {
      columnDef: 'frequency',
      type: 'common',
      header: 'Frequency',
      cell: (row: JobStructure) => this._getTimeFromCron(row.cronExpression)
    },
    {
      columnDef: 'control', header: 'Execution Control',
      type: 'actions',
      actions: [
        { alt: 'Resume', icon: 'play_circle_outline', color: 'primary', event: 'resume' },
        { alt: 'Pause', icon: 'pause_circle_outline', color: 'accent', event: 'pause' },
        { alt: 'Stop', icon: 'check_box_outline_blank', color: 'warn', event: 'stop' }
      ],
      cell: (row: JobStructure) => row
    },
    {
      columnDef: 'actions', header: 'Adm Actions',
      type: 'settings',
      settings: [
        { alt: 'Force Execution', icon: 'admin_panel_settings', event: 'execute' },
        { alt: 'Unschedule', icon: 'date_range', event: 'unschedule' },
        { alt: 'Remove', icon: 'delete_forever', event: 'remove' },
      ],
      cell: (row: JobStructure) => row
    }
  ];

  taskManagerDisplayedColumns = [];
  taskManagerDataSource = new MatTableDataSource<JobStructure>();

  jobsColumns = [
    { columnDef: 'className', type: 'common', header: 'Job Name', cell: (row: JobStructure) => row.className },
    { columnDef: 'group', type: 'common', header: 'Group', cell: (row: JobStructure) => row.group },
    { columnDef: 'state', type: 'common', header: 'State', cell: (row: JobStructure) => row.state },
    {
      columnDef: 'frequency',
      type: 'common',
      header: 'Frequency',
      cell: (row: JobStructure) => this._getTimeFromCron(row.cronExpression) as 'frequency'
    },
    {
      columnDef: 'previousFireTime',
      type: 'common',
      header: 'Last Execution',
      cell: (row: JobStructure) => this._getFormattedDateFromTime(row.previousFireTime)
    },
    {
      columnDef: 'nextFireTime',
      type: 'common',
      header: 'Next Execution',
      cell: (row: JobStructure) => this._getFormattedDateFromTime(row.nextFireTime)
    },
    {
      columnDef: 'startTime',
      type: 'common',
      header: 'Start Date',
      cell: (row: JobStructure) => this._getFormattedDateFromTime(row.startTime)
    },
    {
      columnDef: 'endTime',
      type: 'common',
      header: 'End Date',
      cell: (row: JobStructure) => this._getFormattedDateFromTime(row.endTime)
    },
  ];

  jobsDisplayedColumns = [];
  jobsDataSource = new MatTableDataSource<JobStructure>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isTaskLoading = true;
  isJobsLoading = true;

  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private monitorService: MonitorService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.jobsDisplayedColumns = this.jobsColumns.map(column => column.columnDef);
    this.taskManagerDisplayedColumns = this.taskManagerColumns.map(column => column.columnDef);

    this.monitorService.listJobs().subscribe(jobs => {

      this.taskManagerDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.taskManagerDataSource.paginator = this.paginator;
      this.taskManagerDataSource.sort = this.sort;

      this.jobsDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.jobsDataSource.paginator = this.paginator;
      this.jobsDataSource.sort = this.sort;

      this.isTaskLoading = false;
      this.isJobsLoading = false;
    });
  }

  refreshLogs() {
    this.jobsDataSource = new MatTableDataSource<JobStructure>();
    this.isJobsLoading = true;
    this.monitorService.listJobs().subscribe(jobs => {
      this.jobsDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.isJobsLoading = false;
    });
  }

  actionInvoke(event: string, row: JobStructure) {
    const methodName = event;
    if (this[methodName]) {
      this[event](row);
    }
  }

  execute(row: JobStructure) {
    this.monitorService.execute(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  unschedule(row: JobStructure) {
    this.monitorService.unschedule(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  resume(row: JobStructure) {
    this.monitorService.resume(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  pause(row: JobStructure) {
    this.monitorService.pause(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  stop(row: JobStructure) {
    this.monitorService.stop(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  stopAll() {
    this.monitorService.listJobs().subscribe(jobs => {
      jobs.forEach(job => {
        this.monitorService.stop(job.name, job.group).subscribe(() => {});
      });
      this.alertService.success('Requested to stop each runnning job in execution, check the logs in a few moments.', this.alertOptions);
    });
  }

  _treatAlertMsg(data: any, isError?: boolean) {
    if (data) {
      if (isError) {
        this.alertService.error(data.error.message, this.alertOptions);
      } else {
        this.alertService.success(data.message, this.alertOptions);
        this.refreshLogs();
      }
    }
  }

  _getFormattedDateFromTime(time: number) {
    const formattedDate = (time && time > 0) ?
      moment(time).format('DD/MM/YYYY HH:mm:ss') :
      ' - ';
    return formattedDate;
  }

  _getTimeFromCron(cron: string) {
    const readableCron = (cron && cron !== '') ?
      cronstrue.toString(cron) :
      ' - ';
    return readableCron;
  }

}
