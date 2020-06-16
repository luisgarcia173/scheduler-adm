import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { JobStructure } from 'src/app/shared/models/job-structure';
import { JobsService } from 'src/app/shared/services/jobs.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import CronUtils from 'src/app/shared/utils/cron-utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Routine } from 'src/app/shared/models/routine';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  isFormVisible: boolean;
  jobForm: FormGroup;

  isEditMode: boolean;

  availableJobs: string[];

  jobsColumns = [
    { columnDef: 'className', type: 'common', header: 'Job Name', cell: (row: JobStructure) => row.className },
    { columnDef: 'group', type: 'common', header: 'Group', cell: (row: JobStructure) => row.group },
    { columnDef: 'description', type: 'common', header: 'Description', cell: (row: JobStructure) => row.description },
    { columnDef: 'state', type: 'common', header: 'State', cell: (row: JobStructure) => row.state },
    {
      columnDef: 'frequency',
      type: 'common',
      header: 'Frequency',
      cell: (row: JobStructure) => CronUtils.getTimeFromCron(row.cronExpression) as 'frequency'
    },
    {
      columnDef: 'actions', header: 'Actions',
      type: 'actions',
      actions: [
        { alt: 'Edit', icon: 'edit', color: 'accent', event: 'edit' }
      ],
      cell: (row: JobStructure) => row
    }
  ];

  jobsDisplayedColumns = [];
  jobsDataSource = new MatTableDataSource<JobStructure>();
  isJobsLoading = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  innerWidth: any;
  formLayout = 'row';

  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this._checkFormLayout();
    this._initForm();
    this.jobsDisplayedColumns = this.jobsColumns.map(column => column.columnDef);
    this._renewSearch();

    this.jobsService.listAvailableJobs().subscribe(jobs => {
      this.availableJobs = jobs;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this._checkFormLayout();
  }

  _checkFormLayout() {
    this.formLayout = this.innerWidth < 600 ? 'column' : 'row';
  }

  _initForm() {
    this.jobForm = this.formBuilder.group({
      name: [''],
      group: [''],
      description: [''],
      job: [''],
      executionType: [''],
      frequency: [''],
      frequencyHour: [''],
      routineTime: [''],
      routineType: [''],
      startDate: [''],
      endDate: [''],
    });
    this._fillDefault();
  }

  _fillDefault() {
    this.jobForm.get('executionType').setValue('1');
  }

  _renewSearch() {
    this.jobsDataSource = new MatTableDataSource<JobStructure>();
    this.isJobsLoading = true;
    this.jobsService.listJobs().subscribe(jobs => {
      this.jobsDataSource = new MatTableDataSource<JobStructure>(jobs);
      this.isJobsLoading = false;
      this.jobsDataSource.paginator = this.paginator;
      this.jobsDataSource.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    });
  }

  actionInvoke(event: string, row: JobStructure) {
    const methodName = event;
    if (this[methodName]) {
      this[event](row);
    }
  }

  edit(row: JobStructure) {
    this.isEditMode = true;
    this.jobForm.reset();

    this.jobForm.get('name').setValue(row.name);
    this.jobForm.get('group').setValue(row.group);
    this.jobForm.get('description').setValue(row.description);
    this.jobForm.get('job').setValue(row.className);

    if (row.state === 'UNSCHEDULED') {
      this.jobForm.get('executionType').setValue('1');
    } else {
      this.jobForm.get('executionType').setValue('2');
    }

    this.isFormVisible = true;
  }

  save() {
    if (this.jobForm.invalid || this.jobForm.pending) {
      const controls = this.jobForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    if (this.jobForm.get('name').value && this.jobForm.get('name').value !== '') {
      this._update();
    } else {
      this._add();
    }
  }

  private _update() {
    const form = this.jobForm.getRawValue();
    const isFrequency = form.executionType === '2' ? true : false;
    const routine: Routine = {
      hasFrequency: isFrequency,
      frequency: form.frequency,
      hour: form.frequencyHour,
      hasRoutine: !isFrequency,
      interval: form.routineType,
      time: form.routineTime,
      startDate: form.startDate,
      endDate: form.endDate
    };
    const cronExpression = CronUtils.generateCron(routine);

    this.jobsService.update(form.name, form.group, cronExpression).subscribe(
      data => {
        this.alertService.success('Job successfully updated.', this.alertOptions);
        this._renewSearch();
        this.showForm();
      },
      err => {
        this.alertService.error('Error while trying to update the job.', this.alertOptions);
        console.error(err.error.message);
      }
    );
  }

  private _add() {
    const newJob = {
      cronExpression: '',
      description: this.jobForm.get('description').value,
      group: this.jobForm.get('group').value,
      name: this.jobForm.get('job').value,
      singleRun: false
    };

    if (this.jobForm.get('executionType').value === '1') {
      newJob.singleRun = true;
    } else {
      const form = this.jobForm.getRawValue();
      const isFrequency = form.executionType === '2' ? true : false;
      const routine: Routine = {
        hasFrequency: isFrequency,
        frequency: form.frequency,
        hour: form.frequencyHour,
        hasRoutine: !isFrequency,
        interval: form.routineType,
        time: form.routineTime,
        startDate: form.startDate,
        endDate: form.endDate
      };
      newJob.cronExpression = CronUtils.generateCron(routine);
    }

    this.jobsService.save(newJob).subscribe(
      data => {
        this.alertService.success('Job successfully registered.', this.alertOptions);
        this._renewSearch();
        this.showForm();
      },
      err => {
        this.alertService.error('Error while trying to register the job.', this.alertOptions);
        console.error(err.error.message);
      }
    );
  }

  showForm() {
    this.isEditMode = false;
    this.jobForm.reset();
    this._fillDefault();
    this.isFormVisible = !this.isFormVisible;
  }

}
