import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-auto staff-data-table">
      <table [class]="'w-full caption-bottom text-sm border-collapse table-auto min-w-[720px] ' + class">
        <ng-content />
      </table>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `],
})
export class TableComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <thead class="[&_tr]:border-b bg-muted/40">
      <ng-content />
    </thead>
  `,
  styles: [`:host { display: contents; }`],
})
export class TableHeaderComponent {}

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tbody class="[&_tr:last-child]:border-0">
      <ng-content />
    </tbody>
  `,
  styles: [`:host { display: contents; }`],
})
export class TableBodyComponent {}

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <ng-content />
    </tr>
  `,
  styles: [`:host { display: contents; }`],
})
export class TableRowComponent {}

@Component({
  selector: 'app-table-head',
  standalone: true,
  imports: [CommonModule],
  template: `
    <th [class]="'h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0 ' + class">
      <ng-content />
    </th>
  `,
  styles: [`:host { display: contents; }`],
})
export class TableHeadComponent {
  @Input() class = '';
}

@Component({
  selector: 'app-table-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td [class]="'px-4 py-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 ' + class">
      <ng-content />
    </td>
  `,
  styles: [`:host { display: contents; }`],
})
export class TableCellComponent {
  @Input() class = '';
}
