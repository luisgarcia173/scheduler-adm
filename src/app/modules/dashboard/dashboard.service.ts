import { Injectable } from '@angular/core';
import { JobStructure } from 'src/app/shared/models/job-structure';
import { AreaElement, ElementData } from 'src/app/shared/widgets/area/area.component';
import * as moment from 'moment';
import * as cronParser from 'cron-parser';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  areaChart(jobs: JobStructure[]): AreaElement {

    const content: ElementData = {
      name: 'Jobs',
      data: [ ...this._getFillAreaData(jobs).values() ]
    };

    const areaElement: AreaElement = {
      categories: this._getAreaCategories(),
      content: [content]
    };

    return areaElement;
  }

  private _getAreaCategories() {
    const currentHour = moment().hour();
    const categories = [];
    for (let i = currentHour; i < 24; i++) {
      categories.push(i < 10 ? `0${i}` : i);
    }
    return categories;
  }

  private _getFillAreaData(jobs: JobStructure[]) {
    const maxTime = moment();
    maxTime.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });

    const hours = this._getAreaCategories();
    const hourMap = new Map();
    hours.forEach(hour => hourMap.set(hour, 0));

    jobs.forEach(job => {
      if (job.cronExpression && job.state === 'NORMAL') {
        if (moment(job.nextFireTime).isBefore(maxTime)) {
          const parserOptions = {
            currentDate: moment(job.nextFireTime).toDate(),
            endDate: maxTime.toDate(),
            iterator: true
          };
          const readableCron = job.cronExpression.replace('? ', '');
          const interval = cronParser.parseExpression(readableCron, parserOptions);

          const hour = moment().hour();

          let cronDate = interval.prev();
          let cronMoment = moment(cronDate['value'].toString());
          if (cronMoment.hour() >= hour) {
            hourMap.set(hour, hourMap.get(hour) + 1);
          }
          cronDate = interval.next();
          cronMoment = moment(cronDate['value'].toString());
          if (cronMoment.hour() >= hour) {
            hourMap.set(hour, hourMap.get(hour) + 1);
          }

          while (true) {
            try {
              cronDate = interval.next();
              cronMoment = moment(cronDate['value'].toString());
              const count = hourMap.get(cronMoment.hour()) + 1;
              hourMap.set(cronMoment.hour(), count);
            } catch (e) {
              break;
            }
          }

        }
      }
    });

    return hourMap;
  }

  pieChartState(jobs: JobStructure[]) {
    const states = jobs.map(job => job.state);
    const data = [{
      name: 'Jobs',
      colorByPoint: true,
      data: [{
        name: 'Unscheduled',
        y: states.filter(state => state === 'UNSCHEDULED').length,
        sliced: true,
        selected: true
      }, {
        name: 'Normal',
        y: states.filter(state => state === 'NORMAL').length
      }, {
        name: 'Paused',
        y: states.filter(state => state === 'PAUSED').length
      }, {
        name: 'Complete',
        y: states.filter(state => state === 'COMPLETE').length
      }, {
        name: 'Error',
        y: states.filter(state => state === 'ERROR').length
      }, {
        name: 'Blocked',
        y: states.filter(state => state === 'BLOCKED').length
      }, {
        name: 'None',
        y: states.filter(state => state === 'NONE').length
      }]
    }];

    return data;
  }

  pieChartGroup(jobs: JobStructure[]) {
    const groups = jobs.map(job => job.group);
    const mappedGroups = new Map();
    groups.forEach(group => {
      mappedGroups.set(group, groups.filter(g => g === group).length);
    });
    const mapSorted = new Map([...mappedGroups.entries()].sort((a, b) => b[1] - a[1]));
    const content = [];
    for (const key of mapSorted.keys()) {
      content.push({ name: key, y: mapSorted.get(key) });
    }
    if (content.length > 0) {
      content[0]['sliced'] = true;
      content[0]['selected'] = true;
    }
    const data = [{
      name: 'Group',
      colorByPoint: true,
      data: content
    }];

    return data;
  }

}
