import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { TextareaComponent, LabelComponent } from '../../components/ui/input.component';
import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogDescriptionComponent, DialogFooterComponent } from '../../components/ui/dialog.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

interface PendingReview {
  id: number;
  guestName: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  submittedDate: string;
  status: string;
}

interface DayDetail {
  day: number;
  destination: string;
  attractions: string[];
  mealPlan: string;
  accommodation: string;
}

@Component({
  selector: 'app-agency-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent,
    TextareaComponent,
    LabelComponent,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    IconComponent
  ],
  template: `
    <app-layout title="Pending Itinerary Reviews" role="agency">
      <div class="space-y-6">
        <div class="grid gap-4">
          @for (review of mockPendingReviews; track review.id) {
            <app-card class="hover:shadow-lg transition-shadow">
              <app-card-header>
                <div class="flex justify-between items-start">
                  <div>
                    <app-card-title class="text-xl">{{ review.tripName }}</app-card-title>
                    <app-card-description class="flex items-center mt-1">
                      <app-icon name="users" [size]="12" class="mr-1" />
                      Guest: {{ review.guestName }}
                    </app-card-description>
                  </div>
                  <app-badge class="bg-yellow-100 text-yellow-800">Pending Review</app-badge>
                </div>
              </app-card-header>
              <app-card-content>
                <div class="space-y-3">
                  <div class="flex items-center text-sm text-gray-600">
                    <app-icon name="map-pin" [size]="16" class="mr-2" />
                    {{ review.destination }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <app-icon name="calendar" [size]="16" class="mr-2" />
                    {{ formatDate(review.startDate) }} - {{ formatDate(review.endDate) }}
                    <span class="ml-2">({{ review.daysCount }} days)</span>
                  </div>
                  <div class="text-sm text-gray-500">
                    Submitted: {{ formatDate(review.submittedDate) }}
                  </div>

                  <div class="flex space-x-2 pt-3">
                    <button
                      class="btn btn-outline btn-sm"
                      (click)="openReviewDialog(review)"
                    >
                      <app-icon name="eye" [size]="16" class="mr-2" />
                      Review Details
                    </button>
                    <button
                      class="btn btn-primary btn-sm"
                      (click)="handleApprove(review.id)"
                    >
                      <app-icon name="circle-check" [size]="16" class="mr-2" />
                      Quick Approve
                    </button>
                  </div>
                </div>
              </app-card-content>
            </app-card>
          }
        </div>
      </div>

      <!-- Review Dialog -->
      <app-dialog
        [open]="isDialogOpen"
        (openChange)="isDialogOpen = $event"
        size="xl"
        class="max-h-[80vh] overflow-y-auto"
      >
        @if (selectedItinerary) {
          <app-dialog-header>
            <app-dialog-title>{{ selectedItinerary.tripName }}</app-dialog-title>
            <app-dialog-description>
              Review and provide feedback on this itinerary
            </app-dialog-description>
          </app-dialog-header>

          <div class="space-y-4 py-4">
            <!-- Guest Info -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold mb-2">Trip Information</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-gray-600">Guest:</span> {{ selectedItinerary.guestName }}
                </div>
                <div>
                  <span class="text-gray-600">Duration:</span> {{ selectedItinerary.daysCount }} days
                </div>
                <div class="col-span-2">
                  <span class="text-gray-600">Route:</span> {{ selectedItinerary.destination }}
                </div>
              </div>
            </div>

            <!-- Itinerary Details -->
            <div>
              <h4 class="font-semibold mb-3">Day-by-Day Plan</h4>
              <div class="space-y-4">
                @for (day of mockItineraryDetails; track day.day) {
                  <app-card>
                    <app-card-header class="py-3">
                      <app-card-title class="text-base">Day {{ day.day }}: {{ day.destination }}</app-card-title>
                    </app-card-header>
                    <app-card-content class="space-y-2">
                      <div>
                        <span class="text-sm font-medium">Attractions:</span>
                        <ul class="list-disc list-inside text-sm text-gray-600 ml-2">
                          @for (attr of day.attractions; track attr) {
                            <li>{{ attr }}</li>
                          }
                        </ul>
                      </div>
                      <div class="flex space-x-4 text-sm">
                        <span><strong>Meal Plan:</strong> {{ day.mealPlan }}</span>
                        <span><strong>Accommodation:</strong> {{ day.accommodation }}</span>
                      </div>
                    </app-card-content>
                  </app-card>
                }
              </div>
            </div>

            <!-- Route Feasibility Notes -->
            <div class="space-y-2">
              <app-label for="reviewNotes">Route Feasibility & Expert Notes</app-label>
              <app-textarea
                id="reviewNotes"
                placeholder="Add notes about route feasibility, timing, recommendations..."
                [(ngModel)]="reviewNotes"
                [rows]="4"
              />
            </div>

            <!-- Correction Notes -->
            <div class="space-y-2">
              <app-label for="correctionNotes">Correction Notes (if returning to guest)</app-label>
              <app-textarea
                id="correctionNotes"
                placeholder="Specify what needs to be corrected..."
                [(ngModel)]="correctionNotes"
                [rows]="3"
              />
            </div>
          </div>

          <app-dialog-footer class="flex space-x-2">
            <button class="btn btn-destructive" (click)="handleReject()">
              <app-icon name="circle-x" [size]="16" class="mr-2" />
              Reject
            </button>
            <button class="btn btn-outline" (click)="handleReturnForCorrection()">
              <app-icon name="circle-alert" [size]="16" class="mr-2" />
              Return for Correction
            </button>
            <button class="btn btn-primary" (click)="handleApprove(selectedItinerary.id)">
              <app-icon name="circle-check" [size]="16" class="mr-2" />
              Approve & Continue to Pricing
            </button>
          </app-dialog-footer>
        }
      </app-dialog>
    </app-layout>
  `
})
export class AgencyReviewComponent {
  private router = inject(Router);
  private toastService = inject(ToastService);

  isDialogOpen = false;
  selectedItinerary: PendingReview | null = null;
  reviewNotes = '';
  correctionNotes = '';

  mockPendingReviews: PendingReview[] = [
    {
      id: 1,
      guestName: 'John Doe',
      tripName: 'European Adventure',
      destination: 'Paris - Rome - Barcelona',
      startDate: '2026-03-15',
      endDate: '2026-03-25',
      daysCount: 10,
      submittedDate: '2026-01-05',
      status: 'pending'
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      tripName: 'Asian Discovery',
      destination: 'Tokyo - Kyoto - Osaka',
      startDate: '2026-04-10',
      endDate: '2026-04-20',
      daysCount: 10,
      submittedDate: '2026-01-06',
      status: 'pending'
    },
    {
      id: 3,
      guestName: 'Mike Johnson',
      tripName: 'Safari Adventure',
      destination: 'Kenya - Tanzania',
      startDate: '2026-05-01',
      endDate: '2026-05-10',
      daysCount: 9,
      submittedDate: '2026-01-04',
      status: 'pending'
    },
  ];

  mockItineraryDetails: DayDetail[] = [
    {
      day: 1,
      destination: 'Paris, France',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
      mealPlan: 'BB',
      accommodation: 'Hotel'
    },
    {
      day: 2,
      destination: 'Paris, France',
      attractions: ['Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Elysees'],
      mealPlan: 'HB',
      accommodation: 'Hotel'
    },
    {
      day: 3,
      destination: 'Rome, Italy',
      attractions: ['Colosseum', 'Roman Forum', 'Trevi Fountain'],
      mealPlan: 'FB',
      accommodation: 'Hotel'
    },
  ];

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  openReviewDialog(review: PendingReview): void {
    this.selectedItinerary = review;
    this.isDialogOpen = true;
  }

  handleApprove(id: number): void {
    this.toastService.success('Itinerary approved successfully');
    this.isDialogOpen = false;
    this.router.navigate(['/agency/pricing', id]);
  }

  handleReturnForCorrection(): void {
    this.toastService.info('Itinerary returned to guest for corrections');
    this.isDialogOpen = false;
    this.selectedItinerary = null;
    this.correctionNotes = '';
  }

  handleReject(): void {
    this.toastService.error('Itinerary rejected');
    this.isDialogOpen = false;
    this.selectedItinerary = null;
  }
}
