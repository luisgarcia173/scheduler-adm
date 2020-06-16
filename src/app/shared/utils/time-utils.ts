import * as moment from 'moment';

export default class TimeUtils {

  public static getFormattedDateFromTime(time: number) {
    const formattedDate = (time && time > 0) ?
      moment(time).format('DD/MM/YYYY HH:mm:ss') :
      ' - ';
    return formattedDate;
  }

}
