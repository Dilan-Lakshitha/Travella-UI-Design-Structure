import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="separatorClasses"
      role="none"
    ></div>
  `
})
export class SeparatorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() class = '';

  get separatorClasses(): string {
    const baseClasses = 'shrink-0 bg-border';
    const orientationClasses = this.orientation === 'horizontal' 
      ? 'h-[1px] w-full' 
      : 'h-full w-[1px]';
    return `${baseClasses} ${orientationClasses} ${this.class}`.trim();
  }
}
