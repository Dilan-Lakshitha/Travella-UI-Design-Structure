import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="class">
      <ng-content />
    </div>
  `
})
export class TabsComponent {
  @Input() value = '';
  @Input() class = '';
  @Output() valueChange = new EventEmitter<string>();

  selectTab(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ' + class">
      <ng-content />
    </div>
  `
})
export class TabsListComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="triggerClasses"
      (click)="onClick()"
    >
      <ng-content />
    </button>
  `
})
export class TabsTriggerComponent {
  @Input() value = '';
  @Input() active = false;
  @Input() class = '';
  @Output() tabSelect = new EventEmitter<string>();

  get triggerClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const activeClasses = this.active ? 'bg-background text-foreground shadow-sm' : '';
    return `${baseClasses} ${activeClasses} ${this.class}`.trim();
  }

  onClick(): void {
    this.tabSelect.emit(this.value);
  }
}

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="active"
      [class]="'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' + class"
    >
      <ng-content />
    </div>
  `
})
export class TabsContentComponent {
  @Input() value = '';
  @Input() active = false;
  @Input() class = '';
}
