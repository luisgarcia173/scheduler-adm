import cronstrue from 'cronstrue';
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
          cron = `0 0 ${hour} ? * * *`;
          break;
        case 2:
          const weekDay = startDate.day();
          cron = `0 0 ${hour} ? * ${weekDay} *`;
          break;
        case 3:
          const dayOfTheMonth = startDate.date();
          cron = `0 0 ${hour} ${dayOfTheMonth} * ? *`;
          break;
      }
    }

    if (routine.hasRoutine) {
      const time = routine.time;
      const interval = Number(routine.interval);

      switch (interval) {
        case 1:
          cron = `0 0 0/${time} 1/1 * ? *`;
          break;
        case 2:
          cron = `0 0/${time} * 1/1 * ? *`;
          break;
        case 3:
          cron = `0/${time} * * 1/1 * ? *`;
          break;
      }
    }

    return cron;

  }

}
