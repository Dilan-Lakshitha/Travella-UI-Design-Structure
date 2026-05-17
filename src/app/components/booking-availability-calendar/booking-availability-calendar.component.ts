import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  buildDayStatusMap,
  dayStatusClass,
  parseDateKey,
  toDateKey,
  type CalendarDayStatus,
} from '../../utils/calendar-day-status.util';
import type { StaffBookingCalendarItem } from '../../models/calendar.models';

interface CalendarCell {
  day: number | null;
  dateKey: string | null;
  status: CalendarDayStatus | null;
}

@Component({
  selector: 'app-booking-availability-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-availability-calendar.component.html',
  styleUrls: ['./booking-availability-calendar.component.scss'],
})
export class BookingAvailabilityCalendarComponent implements OnChanges {
  @Input() startDate = '';
  @Input() endDate = '';
  @Input() bookings: StaffBookingCalendarItem[] = [];
  @Input() staffId: number | null = null;
  @Input() title = 'Availability';

  readonly dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  calendarCells: CalendarCell[] = [];
  dayStatusMap = new Map<string, CalendarDayStatus>();

  ngOnChanges(): void {
    this.syncVisibleMonth();
    this.rebuild();
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.rebuildCells();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.rebuildCells();
  }

  cellClass(status: CalendarDayStatus | null): string {
    if (!status) {
      return 'booking-cal__cell booking-cal-day--empty';
    }
    return `booking-cal__cell ${dayStatusClass(status)}`;
  }

  private syncVisibleMonth(): void {
    const anchor = this.startDate ? parseDateKey(this.startDate) : new Date();
    this.currentMonth = anchor.getMonth();
    this.currentYear = anchor.getFullYear();
  }

  private rebuild(): void {
    if (this.startDate && this.endDate) {
      this.dayStatusMap = buildDayStatusMap(
        this.startDate,
        this.endDate,
        this.bookings,
        this.staffId,
      );
    } else {
      this.dayStatusMap = new Map();
    }
    this.rebuildCells();
  }

  private rebuildCells(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const cells: CalendarCell[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, dateKey: null, status: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dateKey = toDateKey(date);
      const inFilter =
        !this.startDate ||
        !this.endDate ||
        (dateKey >= this.startDate && dateKey <= this.endDate);
      const status = inFilter ? (this.dayStatusMap.get(dateKey) ?? 'AVAILABLE') : null;
      cells.push({ day, dateKey, status });
    }

    this.calendarCells = cells;
  }
}
