import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="class">
      <ng-content />
    </div>
  `
})
export class AccordionComponent {
  @Input() class = '';
  @Input() type: 'single' | 'multiple' = 'single';
  @Input() collapsible = true;
}

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b">
      <ng-content />
    </div>
  `
})
export class AccordionItemComponent {
  @Input() value = '';
}

@Component({
  selector: 'app-accordion-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="flex">
      <button
        type="button"
        class="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
        (click)="toggle.emit()"
      >
        <ng-content />
        <svg
          class="h-4 w-4 shrink-0 transition-transform duration-200"
          [class.rotate-180]="expanded"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </h3>
  `
})
export class AccordionTriggerComponent {
  @Input() expanded = false;
  @Output() toggle = new EventEmitter<void>();
}

@Component({
  selector: 'app-accordion-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="expanded"
      class="overflow-hidden text-sm animate-slide-in"
    >
      <div class="pb-4 pt-0">
        <ng-content />
      </div>
    </div>
  `
})
export class AccordionContentComponent {
  @Input() expanded = false;
}
