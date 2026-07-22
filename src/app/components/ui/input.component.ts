import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <input
      [type]="type"
      [id]="id"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [required]="required"
      [class]="inputClasses"
      [(ngModel)]="value"
      (ngModelChange)="onValueChange($event)"
      (blur)="onTouched()"
    />
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() id = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() class = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputClasses(): string {
    return `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${this.class}`.trim();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }
}

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label
      [for]="for"
      [class]="'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' + class"
    >
      <ng-content />
    </label>
  `
})
export class LabelComponent {
  @Input() for = '';
  @Input() class = '';
}

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <textarea
      [id]="id"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [rows]="rows"
      [class]="textareaClasses"
      [(ngModel)]="value"
      (ngModelChange)="onValueChange($event)"
      (blur)="onTouched()"
    ></textarea>
  `
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() rows = 3;
  @Input() class = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get textareaClasses(): string {
    return `flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${this.class}`.trim();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }
}
