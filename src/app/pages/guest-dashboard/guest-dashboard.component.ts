import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { IconComponent } from '../../components/ui/icons.component';

interface Itinerary {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'confirmed' | 'corrected';
  daysCount: number;
}

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent,
    IconComponent
  ],
  template: `
    <app-layout title="My Travel Plans" role="guest">
      <div class="space-y-6">
        <!-- Action Button -->
        <div class="flex justify-between items-center">
          <p class="text-gray-600">Plan your dream vacation with personalized itineraries</p>
          <button class="btn btn-primary" (click)="navigateToBuilder()">
            <app-icon name="plus" [size]="16" class="mr-2" />
            Customize Your Tour
          </button>
        </div>

        <!-- Draft Itineraries -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Draft Itineraries</h3>
          @if (draftItineraries.length === 0) {
            <app-card>
              <app-card-content class="pt-6 text-center text-gray-500">
                No draft itineraries. Start planning your next adventure!
              </app-card-content>
            </app-card>
          } @else {
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              @for (itinerary of draftItineraries; track itinerary.id) {
                <app-card class="hover:shadow-lg transition-shadow cursor-pointer">
                  <app-card-header>
                    <div class="flex justify-between items-start">
                      <app-card-title class="text-lg">{{ itinerary.title }}</app-card-title>
                      <app-badge [class]="getStatusColor(itinerary.status)">
                        {{ itinerary.status }}
                      </app-badge>
                    </div>
                    <app-card-description class="flex items-center">
                      <app-icon name="map-pin" [size]="12" class="mr-1" />
                      {{ itinerary.destination }}
                    </app-card-description>
                  </app-card-header>
                  <app-card-content class="space-y-3">
                    <div class="flex items-center text-sm text-gray-600">
                      <app-icon name="calendar" [size]="16" class="mr-2" />
                      {{ formatDate(itinerary.startDate) }} - {{ formatDate(itinerary.endDate) }}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <app-icon name="clock" [size]="16" class="mr-2" />
                      {{ itinerary.daysCount }} days
                    </div>
                    <div class="flex space-x-2">
                      <button
                        class="btn btn-primary btn-sm flex-1"
                        (click)="navigateToBuilder()"
                      >
                        Continue Editing
                      </button>
                    </div>
                  </app-card-content>
                </app-card>
              }
            </div>
          }
        </div>

        <!-- Submitted Itineraries -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Submitted for Review</h3>
          @if (submittedItineraries.length === 0) {
            <app-card>
              <app-card-content class="pt-6 text-center text-gray-500">
                No submitted itineraries
              </app-card-content>
            </app-card>
          } @else {
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              @for (itinerary of submittedItineraries; track itinerary.id) {
                <app-card class="hover:shadow-lg transition-shadow">
                  <app-card-header>
                    <div class="flex justify-between items-start">
                      <app-card-title class="text-lg">{{ itinerary.title }}</app-card-title>
                      <app-badge [class]="getStatusColor(itinerary.status)">
                        {{ itinerary.status }}
                      </app-badge>
                    </div>
                    <app-card-description class="flex items-center">
                      <app-icon name="map-pin" [size]="12" class="mr-1" />
                      {{ itinerary.destination }}
                    </app-card-description>
                  </app-card-header>
                  <app-card-content class="space-y-3">
                    <div class="flex items-center text-sm text-gray-600">
                      <app-icon name="calendar" [size]="16" class="mr-2" />
                      {{ formatDate(itinerary.startDate) }} - {{ formatDate(itinerary.endDate) }}
                    </div>
                    <div class="text-sm text-blue-600">
                      Under review by our travel experts
                    </div>
                  </app-card-content>
                </app-card>
              }
            </div>
          }
        </div>

        <!-- Approved Itineraries -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Approved Itineraries</h3>
          @if (approvedItineraries.length === 0) {
            <app-card>
              <app-card-content class="pt-6 text-center text-gray-500">
                No approved itineraries yet
              </app-card-content>
            </app-card>
          } @else {
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              @for (itinerary of approvedItineraries; track itinerary.id) {
                <app-card class="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
                  <app-card-header>
                    <div class="flex justify-between items-start">
                      <app-card-title class="text-lg">{{ itinerary.title }}</app-card-title>
                      <app-badge [class]="getStatusColor(itinerary.status)">
                        {{ itinerary.status }}
                      </app-badge>
                    </div>
                    <app-card-description class="flex items-center">
                      <app-icon name="map-pin" [size]="12" class="mr-1" />
                      {{ itinerary.destination }}
                    </app-card-description>
                  </app-card-header>
                  <app-card-content class="space-y-3">
                    <div class="flex items-center text-sm text-gray-600">
                      <app-icon name="calendar" [size]="16" class="mr-2" />
                      {{ formatDate(itinerary.startDate) }} - {{ formatDate(itinerary.endDate) }}
                    </div>
                    <button
                      class="btn btn-primary btn-sm w-full"
                      (click)="navigateToBooking(itinerary.id)"
                    >
                      View Details
                    </button>
                  </app-card-content>
                </app-card>
              }
            </div>
          }
        </div>
      </div>
    </app-layout>
  `
})
export class GuestDashboardComponent {
  private router = inject(Router);

  mockItineraries: Itinerary[] = [
    {
      id: 1,
      title: 'European Adventure',
      destination: 'Paris, France → Rome, Italy',
      startDate: '2026-03-15',
      endDate: '2026-03-25',
      status: 'draft',
      daysCount: 10
    },
    {
      id: 2,
      title: 'Asian Discovery Tour',
      destination: 'Tokyo → Kyoto → Osaka',
      startDate: '2026-04-10',
      endDate: '2026-04-20',
      status: 'submitted',
      daysCount: 10
    },
    {
      id: 3,
      title: 'Beach Paradise',
      destination: 'Maldives',
      startDate: '2026-02-01',
      endDate: '2026-02-08',
      status: 'approved',
      daysCount: 7
    },
    {
      id: 4,
      title: 'Mountain Retreat',
      destination: 'Swiss Alps',
      startDate: '2026-01-20',
      endDate: '2026-01-27',
      status: 'confirmed',
      daysCount: 7
    },
  ];

  get draftItineraries(): Itinerary[] {
    return this.mockItineraries.filter(i => i.status === 'draft');
  }

  get submittedItineraries(): Itinerary[] {
    return this.mockItineraries.filter(i => i.status === 'submitted');
  }

  get approvedItineraries(): Itinerary[] {
    return this.mockItineraries.filter(i => ['approved', 'confirmed'].includes(i.status));
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      confirmed: 'bg-purple-100 text-purple-800',
      corrected: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  navigateToBuilder(): void {
    this.router.navigate(['/guest/itinerary-builder']);
  }

  navigateToBooking(id: number): void {
    this.router.navigate(['/guest/booking', id]);
  }
}
