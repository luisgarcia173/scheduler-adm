import cronstrue from 'cronstrue';
import cronTime from 'cron-time-generator';
import { Routine } from '../models/routine';

export default class CronUtils {

  public static getTimeFromCron(cron: string): string {
    const readableCron = (cron && cron !== '') ?
      cronstrue.toString(cron) :
      ' - ';
    return readableCron;
  }

  public static generateCron(routine: Routine): string {

    let cron = '';

    // startDate: string;
    // endDate: string;

    if (routine.hasFrequency) {
      const hour = routine.hour;
      const frequency = Number(routine.frequency);
      const startDate = routine.startDate;

      switch (frequency) {
        case 1:
          cron = cronTime.everyDayAt(hour);
          break;
        case 2:
          const weekDay = startDate.day();
          cron = cronTime.everyWeekAt(weekDay, hour, 0);
          break;
        case 3:
          const dayOfTheMonth = startDate.date();
          cron = cronTime.everyMonthOn(dayOfTheMonth, hour, 0);
          break;
      }
    }

    if (routine.hasRoutine) {
      const time = routine.time;
      const interval = Number(routine.interval);

      switch (interval) {
        case 1:
          cron = cronTime.every(time).hours();
          break;
        case 2:
          cron = cronTime.every(time).minutes();
          break;
        case 3:
          cron = `0/${time} 0 0 ? * * *`;
          break;
      }
    }

    return cron;

  }

}
