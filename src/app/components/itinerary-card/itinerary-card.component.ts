import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent, CardContentComponent, CardDescriptionComponent, CardHeaderComponent, CardTitleComponent } from '../ui/card.component';
import { BadgeComponent } from '../ui/badge.component';
import { IconComponent } from '../ui/icons.component';
import type { GuestItineraryRow } from '../../models/itinerary.models';

@Component({
  selector: 'app-itinerary-card',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent,
    IconComponent,
  ],
  template: `
    <app-card class="hover:shadow-lg transition-shadow">
      <app-card-header>
        <div class="flex justify-between items-start">
          <app-card-title class="text-lg">{{ item.tripName }}</app-card-title>
          <app-badge [class]="statusClass">{{ statusLabel }}</app-badge>
        </div>
        <app-card-description class="flex items-center">
          <app-icon name="map-pin" [size]="12" class="mr-1" />
          {{ item.destination }}
        </app-card-description>
      </app-card-header>
      <app-card-content class="space-y-3">
        <div class="flex items-center text-sm text-gray-600">
          <app-icon name="calendar" [size]="16" class="mr-2" />
          {{ item.startDate | date }} - {{ item.endDate | date }}
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <app-icon name="clock" [size]="16" class="mr-2" />
          {{ item.daysCount }} days
        </div>
        @if (item.totalPrice != null) {
          <div class="text-sm font-semibold text-green-700">Total Price: {{ item.totalPrice | currency }}</div>
        }
        @if (item.lastMessagePreview) {
          <div class="text-xs text-red-600 truncate">{{ item.lastMessagePreview }}</div>
        }
        <ng-content />
      </app-card-content>
    </app-card>
  `,
})
export class ItineraryCardComponent {
  @Input({ required: true }) item!: GuestItineraryRow;
  @Input() statusLabel = '';
  @Input() statusClass = 'bg-gray-100 text-gray-800';
  @Output() clicked = new EventEmitter<void>();
}

