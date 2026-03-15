import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { SeparatorComponent } from '../../components/ui/separator.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    BadgeComponent,
    SeparatorComponent,
    IconComponent
  ],
  template: `
    <app-layout title="Booking Summary" role="guest">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Status Banner -->
        <app-card class="border-green-200 bg-green-50">
          <app-card-content class="pt-6">
            <div class="flex items-center">
              <app-icon name="circle-check" [size]="48" class="text-green-600 mr-4" />
              <div>
                <h3 class="text-xl font-semibold text-green-900">Itinerary Approved!</h3>
                <p class="text-green-700">Your customized travel package is ready. Review the details and confirm your booking.</p>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <!-- Trip Overview -->
        <app-card>
          <app-card-header>
            <div class="flex justify-between items-start">
              <app-card-title>Beach Paradise</app-card-title>
              <app-badge class="bg-green-100 text-green-800">Approved</app-badge>
            </div>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="flex items-center">
                <app-icon name="map-pin" [size]="20" class="mr-3 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-500">Destination</p>
                  <p class="font-medium">Maldives</p>
                </div>
              </div>
              <div class="flex items-center">
                <app-icon name="calendar" [size]="20" class="mr-3 text-gray-400" />
                <div>
                  <p class="text-sm text-gray-500">Travel Dates</p>
                  <p class="font-medium">Feb 1 - Feb 8, 2026 (7 days)</p>
                </div>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <!-- Final Itinerary -->
        <app-card>
          <app-card-header>
            <app-card-title>Final Itinerary</app-card-title>
          </app-card-header>
          <app-card-content>
            <div class="space-y-4">
              @for (day of itineraryDays; track day.day) {
                <div class="border rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold">Day {{ day.day }}: {{ day.destination }}</h4>
                    @if (day.accommodation !== '-') {
                      <span class="text-sm text-gray-500">{{ day.accommodation }}</span>
                    }
                  </div>
                  <p class="text-sm text-gray-600">{{ day.activities }}</p>
                </div>
              }
            </div>
          </app-card-content>
        </app-card>

        <!-- Assigned Staff -->
        <app-card>
          <app-card-header>
            <app-card-title>Assigned Staff & Resources</app-card-title>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="rounded-full bg-blue-100 p-2 mr-3">
                  <app-icon name="car" [size]="20" class="text-blue-600" />
                </div>
                <div>
                  <p class="font-medium">Driver</p>
                  <p class="text-sm text-gray-600">Michael Chen</p>
                </div>
              </div>
              <p class="text-sm text-gray-500">+1 234-567-8900</p>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="rounded-full bg-purple-100 p-2 mr-3">
                  <app-icon name="user-check" [size]="20" class="text-purple-600" />
                </div>
                <div>
                  <p class="font-medium">Tour Guide</p>
                  <p class="text-sm text-gray-600">Emma Thompson</p>
                </div>
              </div>
              <p class="text-sm text-gray-500">English, French</p>
            </div>
          </app-card-content>
        </app-card>

        <!-- Accommodation Details -->
        <app-card>
          <app-card-header>
            <app-card-title class="flex items-center">
              <app-icon name="home" [size]="20" class="mr-2" />
              Accommodation Details
            </app-card-title>
          </app-card-header>
          <app-card-content>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Property:</span>
                <span class="font-medium">Paradise Island Resort & Spa</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Room Type:</span>
                <span class="font-medium">Water Villa with Private Pool</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Meal Plan:</span>
                <span class="font-medium">All Inclusive</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Check-in:</span>
                <span class="font-medium">Feb 1, 2026 - 2:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Check-out:</span>
                <span class="font-medium">Feb 8, 2026 - 12:00 PM</span>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <!-- Total Price -->
        <app-card class="border-blue-200 bg-blue-50">
          <app-card-header>
            <app-card-title class="flex items-center text-blue-900">
              <app-icon name="dollar-sign" [size]="20" class="mr-2" />
              Total Package Price
            </app-card-title>
          </app-card-header>
          <app-card-content>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>Accommodation (6 nights)</span>
                <span>$2,400</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Transportation</span>
                <span>$1,200</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Driver & Guide Fees</span>
                <span>$1,300</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Activities & Attractions</span>
                <span>$450</span>
              </div>
              <app-separator class="my-3" />
              <div class="flex justify-between text-xl font-bold text-blue-900">
                <span>Total:</span>
                <span>$5,350.00</span>
              </div>
              <p class="text-xs text-blue-700 mt-2">*All taxes and fees included</p>
            </div>
          </app-card-content>
        </app-card>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button class="btn btn-outline" (click)="handleRequestChanges()">
            <app-icon name="pencil" [size]="16" class="mr-2" />
            Request Changes
          </button>
          <button class="btn btn-primary btn-lg" (click)="handleConfirmBooking()">
            <app-icon name="circle-check" [size]="16" class="mr-2" />
            Confirm Booking
          </button>
        </div>
      </div>
    </app-layout>
  `
})
export class BookingConfirmationComponent {
  @Input() id = '';
  
  private router = inject(Router);
  private toastService = inject(ToastService);

  itineraryDays = [
    { day: 1, destination: 'Male, Maldives', activities: 'Arrival, Resort Check-in, Beach Welcome Dinner', accommodation: 'Water Villa' },
    { day: 2, destination: 'Male, Maldives', activities: 'Snorkeling Tour, Sunset Cruise', accommodation: 'Water Villa' },
    { day: 3, destination: 'Male, Maldives', activities: 'Spa Day, Private Beach Time', accommodation: 'Water Villa' },
    { day: 4, destination: 'Male, Maldives', activities: 'Scuba Diving, Island Hopping', accommodation: 'Water Villa' },
    { day: 5, destination: 'Male, Maldives', activities: 'Dolphin Watching, Beach Activities', accommodation: 'Water Villa' },
    { day: 6, destination: 'Male, Maldives', activities: 'Underwater Restaurant Lunch, Relaxation', accommodation: 'Water Villa' },
    { day: 7, destination: 'Male, Maldives', activities: 'Departure', accommodation: '-' },
  ];

  handleConfirmBooking(): void {
    this.toastService.success('Booking confirmed! You will receive confirmation email shortly.');
    setTimeout(() => this.router.navigate(['/guest/dashboard']), 2000);
  }

  handleRequestChanges(): void {
    this.toastService.info('Change request sent to travel expert');
  }
}
