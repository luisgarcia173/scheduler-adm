import { Moment } from 'moment';

export interface Routine {
  hasFrequency: boolean;
  frequency: number;
  hour: number;
  hasRoutine: boolean;
  interval: number;
  time: number;
  startDate: Moment;
  endDate: Moment;
}
