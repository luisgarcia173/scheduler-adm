import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from './dashboard.service';
import { JobsService } from 'src/app/shared/services/jobs.service';
import { CardElement } from 'src/app/shared/widgets/card/card.component';
import { AreaElement } from 'src/app/shared/widgets/area/area.component';
import { JobStructure } from 'src/app/shared/models/job-structure';
import TimeUtils from 'src/app/shared/utils/time-utils';
import CronUtils from 'src/app/shared/utils/cron-utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  areaChart: AreaElement;

  cardAvailable: CardElement;
  cardUsage: CardElement;
  cardHit: CardElement;
  cardRisk: CardElement;

  stateData = [];
  groupData = [];

  showArea = false;
  showCards = false;
  showPies = false;

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
  @ViewChild('jobPaginator', { read: MatPaginator }) jobPaginator: MatPaginator;
  @ViewChild('jobSort', { read: MatSort }) jobSort: MatSort;
  isJobsLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private jobsService: JobsService
  ) { }

  ngOnInit(): void {
    this.jobsDisplayedColumns = this.jobsColumns.map(column => column.columnDef);

    this.jobsService.listJobs().subscribe(jobs => {

      this.areaChart = this.dashboardService.areaChart(jobs);
      this.showArea = true;

      this.cardUsage = this._fillCardUsage(jobs);
      this.cardHit = this._fillCardHit(jobs);
      this.cardRisk = this._fillCardRisk(jobs);

      this.jobsService.listAvailableJobs().subscribe(candidates => {
        const mapReduceJobs = jobs
          .map(job => job.className)
          .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
        this.cardAvailable = this._fillCardAvailble(mapReduceJobs, candidates);

        this.showCards = true;
      });

      this.stateData = this.dashboardService.pieChartState(jobs);
      this.groupData = this.dashboardService.pieChartGroup(jobs);
      this.showPies = true;

      this.jobsDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.jobsDataSource.paginator = this.jobPaginator;
      this.jobsDataSource.sort = this.jobSort;
      this.isJobsLoading = false;
    });

  }

  private _fillCardAvailble(jobs: string[], candidates: string[]) {

    let used = 0;
    jobs.forEach(job => {
      if (candidates.includes(job)) {
        used++;
      }
    });

    const percent = ((used / candidates.length) * 100).toFixed(2);

    const data = {
      title: 'REGISTERED x AVAILABLE',
      icon: 'event_available',
      value: String(used),
      of: String(candidates.length),
      percentage: String(percent),
      description: 'Total of Jobs:',
      detail: null
    };
    return data;
  }

  private _fillCardUsage(jobs: JobStructure[]) {

    const total = jobs.length;
    const inUse = jobs.map(job => job.state).filter(state => state === 'NORMAL').length;
    const percent = ((inUse / total) * 100).toFixed(2);

    const data = {
      title: 'REGISTERED x USED',
      icon: 'event',
      value: String(inUse),
      of: String(total),
      percentage: String(percent),
      description: 'Total of Jobs:',
      detail: null
    };
    return data;
  }

  private _fillCardHit(jobs: JobStructure[]) {

    const jobNames = jobs.map(job => job.className);
    const mappedGroups = new Map();
    jobNames.forEach(jobName => {
      mappedGroups.set(jobName, jobNames.filter(jn => jn === jobName).length);
    });
    const mapSorted = new Map([...mappedGroups.entries()].sort((a, b) => b[1] - a[1]));

    const highestHitted = mapSorted.entries().next().value;

    const total = jobs.length;
    const percent = ((highestHitted[1] / total) * 100).toFixed(2);

    const data = {
      title: 'USED x HIT',
      icon: 'event_note',
      value: String(highestHitted[1]),
      of: String(total),
      percentage: String(percent),
      description: 'Total of Hits',
      detail: `${highestHitted[0]}`
    };
    return data;
  }

  private _fillCardRisk(jobs: JobStructure[]) {
    const total = jobs.length;
    const inUse = jobs
      .map(job => job.state)
      .filter(state => {
        return ( state === 'PAUSED' || state === 'ERROR' || state === 'BLOCKED');
      }).length;
    const percent = ((inUse / total) * 100).toFixed(2);

    const data = {
      title: 'RISK STATE',
      icon: 'event_busy',
      value: String(inUse),
      of: String(total),
      percentage: String(percent),
      description: 'Total of Jobs:',
      detail: null
    };
    return data;
  }

}
