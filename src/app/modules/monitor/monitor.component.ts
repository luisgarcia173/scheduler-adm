import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import cronstrue from 'cronstrue';
import * as moment from 'moment';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  taskManagerColumns = [
    { columnDef: 'className', type: 'common', header: 'Job Name', cell: (row: JobStructure) => row.className },
    { columnDef: 'group', type: 'common', header: 'Group', cell: (row: JobStructure) => row.group },
    { columnDef: 'state', type: 'common', header: 'State', cell: (row: JobStructure) => row.state },
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
        { alt: 'Resume', icon: 'play_circle_outline', color: 'primary', event: 'execute' },
        { alt: 'Pause', icon: 'pause_circle_outline', color: 'accent', event: 'execute' },
        { alt: 'Stop', icon: 'check_box_outline_blank', color: 'warn', event: 'execute' }
      ],
      cell: (row: JobStructure) => row
    },
    {
      columnDef: 'actions', header: 'Adm Actions',
      type: 'settings',
      settings: [
        { alt: 'Force Execution', icon: 'admin_panel_settings', event: 'execute' },
        { alt: 'Unschedule', icon: 'date_range', event: 'execute' },
        { alt: 'Remove', icon: 'delete_forever', event: 'execute' },
      ],
      cell: (row: JobStructure) => row
    }
  ];

  taskManagerDisplayedColumns = [];
  taskManagerDataSource = new MatTableDataSource<JobStructure>(MOCK_JOBS);

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
  jobsDataSource = new MatTableDataSource<JobStructure>(MOCK_JOBS);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.taskManagerDataSource.paginator = this.paginator;
    this.taskManagerDataSource.sort = this.sort;
    this.taskManagerDisplayedColumns = this.taskManagerColumns.map(column => column.columnDef);

    this.jobsDataSource.paginator = this.paginator;
    this.jobsDataSource.sort = this.sort;
    this.jobsDisplayedColumns = this.jobsColumns.map(column => column.columnDef);
  }

  _getFormattedDateFromTime(time: number) {
    const formattedDate = (time && time > 0) ?
      moment(time).format('DD/MM/yyyy HH:mm:ss') :
      ' - ';
    return formattedDate;
  }

  _getTimeFromCron(cron: string) {
    return cronstrue.toString(cron);
  }

}
export interface JobStructure {
  name: string;
  className: string;
  group: string;
  description: string;
  cronExpression: string;
  state: string;
  startTime: number;
  endTime: number;
  nextFireTime: number;
  previousFireTime: number;
}

const MOCK_JOBS: JobStructure[] = [
  {
    "name": "fc33db9b-68e2-402b-bcef-2ce923fadafc",
    "className": "SayHelloJob",
    "group": "Report",
    "description": "job desc",
    "cronExpression": "0 0/2 * 1/1 * ? *",
    "state": "NORMAL",
    "startTime": null,
    "endTime": null,
    "nextFireTime": 1591706640000,
    "previousFireTime": 1591706541904
  },
  {
    "name": "e2be53de-6d61-443d-b1bc-0f966916c87b",
    "className": "SayByeJob",
    "group": "Report",
    "description": "job desc",
    "cronExpression": "0 0/2 * 1/1 * ? *",
    "state": "PAUSED",
    "startTime": null,
    "endTime": null,
    "nextFireTime": 1591706640000,
    "previousFireTime": 1591706540928
  }
];
