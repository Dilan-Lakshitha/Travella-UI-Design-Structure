import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/80 animate-fade-in"
        (click)="onClose()"
      ></div>
      
      <!-- Dialog Content -->
      <div
        [class]="'relative z-50 grid w-full gap-4 border bg-background p-6 shadow-lg animate-slide-in sm:rounded-lg ' + sizeClasses + ' ' + class"
      >
        <ng-content />
      </div>
    </div>
  `
})
export class DialogComponent {
  @Input() open = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() class = '';
  @Output() openChange = new EventEmitter<boolean>();

  get sizeClasses(): string {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[90vw]'
    };
    return sizes[this.size];
  }

  onClose(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-1.5 text-center sm:text-left">
      <ng-content />
    </div>
  `
})
export class DialogHeaderComponent {}

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold leading-none tracking-tight">
      <ng-content />
    </h2>
  `
})
export class DialogTitleComponent {}

@Component({
  selector: 'app-dialog-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-sm text-muted-foreground">
      <ng-content />
    </p>
  `
})
export class DialogDescriptionComponent {}

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <ng-content />
    </div>
  `
})
export class DialogFooterComponent {}

@Component({
  selector: 'app-dialog-close',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      (click)="close.emit()"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span class="sr-only">Close</span>
    </button>
  `
})
export class DialogCloseComponent {
  @Output() close = new EventEmitter<void>();
}
