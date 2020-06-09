import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
      columnDef: 'previousFireTime',
      type: 'common',
      header: 'Last Execution',
      cell: (row: JobStructure) => this._getFormattedDateFromTime(row.previousFireTime)
    },
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

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.taskManagerDisplayedColumns = this.taskManagerColumns.map(column => column.columnDef);
  }

  _getFormattedDateFromTime(time: number) {
    return moment(time).format('DD/MM/yyyy HH:mm:ss');
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
]
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
