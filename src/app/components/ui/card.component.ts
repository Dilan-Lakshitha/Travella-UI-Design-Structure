import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'rounded-lg border bg-card text-card-foreground shadow-sm ' + class">
      <ng-content />
    </div>
  `
})
export class CardComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'flex flex-col space-y-1.5 p-6 ' + class">
      <ng-content />
    </div>
  `
})
export class CardHeaderComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 [class]="'text-2xl font-semibold leading-none tracking-tight ' + class">
      <ng-content />
    </h3>
  `
})
export class CardTitleComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="'text-sm text-muted-foreground ' + class">
      <ng-content />
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'p-6 pt-0 ' + class">
      <ng-content />
    </div>
  `
})
export class CardContentComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'flex items-center p-6 pt-0 ' + class">
      <ng-content />
    </div>
  `
})
export class CardFooterComponent {
  @Input() class = '';
}
