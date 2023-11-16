import { Injectable } from '@angular/core';
import {TuiDay} from "@taiga-ui/cdk";

@Injectable({
  providedIn: 'root'
})
export class DateService {

  convertTuiDayToDate(date: TuiDay): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  convertTuiDayToISOString(date: TuiDay): string {
    return this.convertTuiDayToDate(date).toISOString();
  }

  convertIsoStringToDate(date: string): Date {
    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(5, 7), 10) - 1;
    const day = parseInt(date.substring(8, 10), 10);
    return new Date(year, month, day);
  }

  convertDateToTuiDay(date: Date): TuiDay {
    return new TuiDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
}
