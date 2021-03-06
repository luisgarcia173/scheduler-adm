import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { JobStructure } from 'src/app/shared/models/job-structure';
import { JobsService } from 'src/app/shared/services/jobs.service';
import CronUtils from 'src/app/shared/utils/cron-utils';
import TimeUtils from 'src/app/shared/utils/time-utils';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  taskManagerColumns = [
    { columnDef: 'className', type: 'common', header: 'Job Name', cell: (row: JobStructure) => row.className },
    { columnDef: 'group', type: 'common', header: 'Group', cell: (row: JobStructure) => row.group },
    { columnDef: 'description', type: 'common', header: 'Description', cell: (row: JobStructure) => row.description },
    {
      columnDef: 'frequency',
      type: 'common',
      header: 'Frequency',
      cell: (row: JobStructure) => CronUtils.getTimeFromCron(row.cronExpression)
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
      cell: (row: JobStructure) => CronUtils.getTimeFromCron(row.cronExpression) as 'frequency'
    },
    {
      columnDef: 'previousFireTime',
      type: 'common',
      header: 'Last Execution',
      cell: (row: JobStructure) => TimeUtils.getFormattedDateFromTime(row.previousFireTime)
    },
    {
      columnDef: 'nextFireTime',
      type: 'common',
      header: 'Next Execution',
      cell: (row: JobStructure) => TimeUtils.getFormattedDateFromTime(row.nextFireTime)
    },
    {
      columnDef: 'startTime',
      type: 'common',
      header: 'Start Date',
      cell: (row: JobStructure) => TimeUtils.getFormattedDateFromTime(row.startTime)
    },
    {
      columnDef: 'endTime',
      type: 'common',
      header: 'End Date',
      cell: (row: JobStructure) => TimeUtils.getFormattedDateFromTime(row.endTime)
    },
  ];

  jobsDisplayedColumns = [];
  jobsDataSource = new MatTableDataSource<JobStructure>();

  @ViewChild('taskPaginator', { read: MatPaginator }) taskPaginator: MatPaginator;
  @ViewChild('jobPaginator', { read: MatPaginator }) jobPaginator: MatPaginator;
  @ViewChild('taskSort', { read: MatSort }) taskSort: MatSort;
  @ViewChild('jobSort', { read: MatSort }) jobSort: MatSort;

  isTaskLoading = true;
  isJobsLoading = true;

  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private jobsService: JobsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.jobsDisplayedColumns = this.jobsColumns.map(column => column.columnDef);
    this.taskManagerDisplayedColumns = this.taskManagerColumns.map(column => column.columnDef);

    this.jobsService.listJobs().subscribe(jobs => {

      this.taskManagerDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.taskManagerDataSource.paginator = this.taskPaginator;
      this.taskManagerDataSource.sort = this.taskSort;

      this.jobsDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.jobsDataSource.paginator = this.jobPaginator;
      this.jobsDataSource.sort = this.jobSort;

      this.isTaskLoading = false;
      this.isJobsLoading = false;
    });
  }

  refreshLogs(isFullReload?: boolean) {
    this.jobsDataSource = new MatTableDataSource<JobStructure>();
    this.isJobsLoading = true;
    if (isFullReload) {
      this.taskManagerDataSource = new MatTableDataSource<JobStructure>();
      this.isTaskLoading = true;
    }
    this.jobsService.listJobs().subscribe(jobs => {
      this.jobsDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.isJobsLoading = false;
      if (isFullReload) {
        this.taskManagerDataSource = new MatTableDataSource<JobStructure>(jobs);
        this.isTaskLoading = false;
      }
    });
  }

  actionInvoke(event: string, row: JobStructure) {
    const methodName = event;
    if (this[methodName]) {
      this[event](row);
    }
  }

  execute(row: JobStructure) {
    this.jobsService.execute(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data, false, true),
      err => this._treatAlertMsg(err, true)
    );
  }

  remove(row: JobStructure) {
    if (confirm('Are you sure to remove this Job permanently?')) {
      this.jobsService.remove(row.name, row.group).subscribe(
        data => this._treatAlertMsg(data, false, true),
        err => this._treatAlertMsg(err, true)
      );
    }
  }

  unschedule(row: JobStructure) {
    this.jobsService.unschedule(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data, false, true),
      err => this._treatAlertMsg(err, true)
    );
  }

  resume(row: JobStructure) {
    this.jobsService.resume(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  pause(row: JobStructure) {
    this.jobsService.pause(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  stop(row: JobStructure) {
    this.jobsService.stop(row.name, row.group).subscribe(
      data => this._treatAlertMsg(data),
      err => this._treatAlertMsg(err, true)
    );
  }

  stopAll() {
    this.jobsService.listJobs().subscribe(jobs => {
      jobs.forEach(job => {
        this.jobsService.stop(job.name, job.group).subscribe(() => {});
      });
      this.alertService.success('Requested to stop each runnning job in execution, check the logs in a few moments.', this.alertOptions);
    });
  }

  _treatAlertMsg(data: any, isError?: boolean, isFullReload?: boolean) {
    if (data) {
      if (isError) {
        this.alertService.error(data.error.message, this.alertOptions);
      } else {
        this.alertService.success(data.message, this.alertOptions);
        this.refreshLogs(isFullReload);
      }
    }
  }

}
