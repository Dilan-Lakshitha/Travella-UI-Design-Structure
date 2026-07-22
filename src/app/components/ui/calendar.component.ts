import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'p-3 ' + class">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground"
          (click)="previousMonth()"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="font-semibold">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground"
          (click)="nextMonth()"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Day Names -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        @for (day of dayNames; track day) {
          <div class="text-center text-xs font-medium text-muted-foreground py-1">
            {{ day }}
          </div>
        }
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1">
        @for (day of calendarDays; track $index) {
          <button
            type="button"
            [class]="getDayClasses(day)"
            [disabled]="!day"
            (click)="day && selectDate(day)"
          >
            {{ day || '' }}
          </button>
        }
      </div>
    </div>
  `
})
export class CalendarComponent {
  @Input() selected: Date | null = null;
  @Input() class = '';
  @Output() selectedChange = new EventEmitter<Date>();

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  get calendarDays(): (number | null)[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }

  getDayClasses(day: number | null): string {
    if (!day) {
      return 'h-9 w-9';
    }

    const baseClasses = 'h-9 w-9 rounded-md text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground';
    
    const isSelected = this.selected && 
      this.selected.getDate() === day && 
      this.selected.getMonth() === this.currentMonth && 
      this.selected.getFullYear() === this.currentYear;

    const isToday = 
      this.currentDate.getDate() === day && 
      this.currentDate.getMonth() === this.currentMonth && 
      this.currentDate.getFullYear() === this.currentYear;

    if (isSelected) {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground`;
    }

    if (isToday) {
      return `${baseClasses} bg-accent text-accent-foreground`;
    }

    return baseClasses;
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  selectDate(day: number): void {
    const date = new Date(this.currentYear, this.currentMonth, day);
    this.selected = date;
    this.selectedChange.emit(date);
  }
}
