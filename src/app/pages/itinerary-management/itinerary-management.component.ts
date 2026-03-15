import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { IconComponent } from '../../components/ui/icons.component';

interface TimelineDay {
  day: number;
  date: string;
  destination: string;
  status: 'planned' | 'confirmed' | 'in-progress' | 'completed';
}

interface Itinerary {
  id: number;
  tripName: string;
  guest: string;
  destination: string;
  startDate: string;
  days: number;
  status: string;
  timeline: TimelineDay[];
}

@Component({
  selector: 'app-itinerary-management',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardContentComponent,
    BadgeComponent,
    IconComponent
  ],
  template: `
    <app-layout title="Itinerary Timeline View" role="admin">
      <div class="space-y-8">
        @for (itinerary of mockItineraries; track itinerary.id) {
          <app-card class="overflow-hidden">
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-2xl font-bold mb-2">{{ itinerary.tripName }}</h3>
                  <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div class="flex items-center">
                      <app-icon name="user" [size]="16" class="mr-2" />
                      Guest: {{ itinerary.guest }}
                    </div>
                    <div class="flex items-center">
                      <app-icon name="map-pin" [size]="16" class="mr-2" />
                      {{ itinerary.destination }}
                    </div>
                    <div class="flex items-center">
                      <app-icon name="clock" [size]="16" class="mr-2" />
                      {{ itinerary.days }} days
                    </div>
                  </div>
                </div>
                <app-badge [class]="getStatusColor(itinerary.status)">
                  {{ itinerary.status }}
                </app-badge>
              </div>
            </div>

            <app-card-content class="p-6">
              <!-- Timeline -->
              <div class="relative">
                <!-- Vertical line -->
                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                <!-- Timeline items -->
                <div class="space-y-6">
                  @for (day of itinerary.timeline; track day.day) {
                    <div class="relative pl-12">
                      <!-- Timeline dot -->
                      <div [class]="'absolute left-2 w-5 h-5 rounded-full border-4 ' + getDotClasses(day.status)"></div>

                      <!-- Content card -->
                      <app-card [class]="'border-2 ' + getDayStatusColor(day.status)">
                        <app-card-content class="p-4">
                          <div class="flex justify-between items-start">
                            <div>
                              <h4 class="font-semibold text-lg mb-1">
                                Day {{ day.day }}: {{ day.destination }}
                              </h4>
                              <p class="text-sm text-gray-600 mb-3">
                                {{ formatDate(day.date) }}
                              </p>
                              <div class="space-y-2">
                                <div class="text-sm">
                                  <span class="font-medium">Activities:</span>
                                  <ul class="list-disc list-inside ml-2 text-gray-600">
                                    <li>Morning city tour</li>
                                    <li>Visit main attractions</li>
                                    <li>Local cuisine experience</li>
                                  </ul>
                                </div>
                                <div class="flex space-x-4 text-sm">
                                  <span><strong>Accommodation:</strong> Hotel Paradise</span>
                                  <span><strong>Meal Plan:</strong> HB</span>
                                </div>
                              </div>
                            </div>
                            <app-badge [class]="getDayBadgeColor(day.status)">
                              {{ day.status }}
                            </app-badge>
                          </div>
                        </app-card-content>
                      </app-card>
                    </div>
                  }
                </div>
              </div>

              <!-- Legend -->
              <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold mb-3">Status Legend:</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full border-4 border-blue-500 bg-white mr-2"></div>
                    <span class="text-sm">Planned</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full border-4 border-green-500 bg-green-500 mr-2"></div>
                    <span class="text-sm">Confirmed</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full border-4 border-purple-500 bg-purple-500 mr-2"></div>
                    <span class="text-sm">In Progress</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full border-4 border-gray-400 bg-gray-400 mr-2"></div>
                    <span class="text-sm">Completed</span>
                  </div>
                </div>
              </div>
            </app-card-content>
          </app-card>
        }
      </div>
    </app-layout>
  `
})
export class ItineraryManagementComponent {
  mockItineraries: Itinerary[] = [
    {
      id: 1,
      tripName: 'European Adventure',
      guest: 'John Doe',
      destination: 'Paris - Rome - Barcelona',
      startDate: '2026-03-15',
      days: 10,
      status: 'submitted',
      timeline: [
        { day: 1, date: '2026-03-15', destination: 'Paris', status: 'planned' },
        { day: 2, date: '2026-03-16', destination: 'Paris', status: 'planned' },
        { day: 3, date: '2026-03-17', destination: 'Paris', status: 'planned' },
        { day: 4, date: '2026-03-18', destination: 'Rome', status: 'planned' },
        { day: 5, date: '2026-03-19', destination: 'Rome', status: 'planned' },
      ]
    },
    {
      id: 2,
      tripName: 'Beach Paradise',
      guest: 'Jane Smith',
      destination: 'Maldives',
      startDate: '2026-02-01',
      days: 7,
      status: 'confirmed',
      timeline: [
        { day: 1, date: '2026-02-01', destination: 'Maldives', status: 'confirmed' },
        { day: 2, date: '2026-02-02', destination: 'Maldives', status: 'confirmed' },
        { day: 3, date: '2026-02-03', destination: 'Maldives', status: 'confirmed' },
      ]
    },
  ];

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

  getDotClasses(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'border-green-500 bg-green-500';
      case 'in-progress':
        return 'border-purple-500 bg-purple-500';
      case 'completed':
        return 'border-gray-400 bg-gray-400';
      default:
        return 'border-blue-500 bg-white';
    }
  }

  getDayStatusColor(status: string): string {
    switch (status) {
      case 'planned':
        return 'border-blue-300 bg-blue-50';
      case 'confirmed':
        return 'border-green-300 bg-green-50';
      case 'in-progress':
        return 'border-purple-300 bg-purple-50';
      case 'completed':
        return 'border-gray-300 bg-gray-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  }

  getDayBadgeColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
