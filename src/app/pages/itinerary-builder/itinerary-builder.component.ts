import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent, TextareaComponent } from '../../components/ui/input.component';
import { SelectComponent, SelectOption } from '../../components/ui/select.component';
import { AccordionComponent, AccordionItemComponent, AccordionTriggerComponent, AccordionContentComponent } from '../../components/ui/accordion.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

interface DayPlan {
  id: number;
  dayNumber: number;
  destination: string;
  attractions: string[];
  mealPlan: string;
  accommodation: string;
  expanded: boolean;
}

@Component({
  selector: 'app-itinerary-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    InputComponent,
    LabelComponent,
    SelectComponent,
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
    IconComponent
  ],
  template: `
    <app-layout title="Create Your Itinerary" role="guest">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Trip Details -->
        <app-card>
          <app-card-header>
            <app-card-title>Trip Details</app-card-title>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <app-label for="tripName">Trip Name</app-label>
                <app-input
                  id="tripName"
                  placeholder="e.g., European Adventure"
                  [(ngModel)]="tripName"
                />
              </div>
              <div class="space-y-2">
                <app-label for="startDate">Start Date</app-label>
                <app-input
                  id="startDate"
                  type="date"
                  [(ngModel)]="startDate"
                />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <app-label for="endDate">End Date</app-label>
                <app-input
                  id="endDate"
                  type="date"
                  [(ngModel)]="endDate"
                />
              </div>
              <div class="space-y-2">
                <app-label>Total Days</app-label>
                <div class="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                  {{ days.length }} {{ days.length === 1 ? 'day' : 'days' }}
                </div>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <!-- Day by Day Planning -->
        <app-card>
          <app-card-header class="flex flex-row items-center justify-between">
            <app-card-title>Day-by-Day Itinerary</app-card-title>
            <button class="btn btn-primary btn-sm" (click)="addDay()">
              <app-icon name="plus" [size]="16" class="mr-2" />
              Add Day
            </button>
          </app-card-header>
          <app-card-content>
            <app-accordion class="w-full">
              @for (day of days; track day.id) {
                <app-accordion-item [value]="'day-' + day.id">
                  <app-accordion-trigger
                    [expanded]="day.expanded"
                    (toggle)="toggleDay(day)"
                  >
                    <div class="flex items-center justify-between w-full pr-4">
                      <span class="font-semibold">Day {{ day.dayNumber }}</span>
                      <span class="text-sm text-gray-500">
                        {{ day.destination || 'No destination set' }}
                      </span>
                    </div>
                  </app-accordion-trigger>
                  <app-accordion-content [expanded]="day.expanded">
                    <div class="space-y-4 pt-4">
                      <div class="space-y-2">
                        <app-label>Destination</app-label>
                        <app-input
                          placeholder="e.g., Paris, France"
                          [(ngModel)]="day.destination"
                        />
                      </div>

                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <app-label>Attractions</app-label>
                          <button
                            type="button"
                            class="btn btn-outline btn-sm"
                            (click)="addAttraction(day)"
                          >
                            <app-icon name="plus" [size]="12" class="mr-1" />
                            Add Attraction
                          </button>
                        </div>
                        @for (attraction of day.attractions; track $index; let i = $index) {
                          <div class="flex space-x-2">
                            <app-input
                              placeholder="e.g., Eiffel Tower"
                              [(ngModel)]="day.attractions[i]"
                              class="flex-1"
                            />
                            @if (day.attractions.length > 1) {
                              <button
                                type="button"
                                class="btn btn-ghost btn-icon"
                                (click)="removeAttraction(day, i)"
                              >
                                <app-icon name="trash" [size]="16" class="text-red-500" />
                              </button>
                            }
                          </div>
                        }
                      </div>

                      <div class="grid gap-4 md:grid-cols-2">
                        <div class="space-y-2">
                          <app-label>Meal Plan</app-label>
                          <app-select
                            [(ngModel)]="day.mealPlan"
                            [options]="mealPlanOptions"
                          />
                        </div>

                        <div class="space-y-2">
                          <app-label>Accommodation Type</app-label>
                          <app-select
                            [(ngModel)]="day.accommodation"
                            [options]="accommodationOptions"
                            placeholder="Select accommodation"
                          />
                        </div>
                      </div>

                      @if (days.length > 1) {
                        <button
                          type="button"
                          class="btn btn-destructive btn-sm"
                          (click)="removeDay(day.id)"
                        >
                          <app-icon name="trash" [size]="16" class="mr-2" />
                          Remove Day
                        </button>
                      }
                    </div>
                  </app-accordion-content>
                </app-accordion-item>
              }
            </app-accordion>
          </app-card-content>
        </app-card>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button class="btn btn-outline" (click)="handleSaveDraft()">
            <app-icon name="save" [size]="16" class="mr-2" />
            Save Draft
          </button>
          <button class="btn btn-primary" (click)="handleSubmit()">
            <app-icon name="send" [size]="16" class="mr-2" />
            Submit for Review
          </button>
        </div>
      </div>
    </app-layout>
  `
})
export class ItineraryBuilderComponent {
  private router = inject(Router);
  private toastService = inject(ToastService);

  tripName = '';
  startDate = '';
  endDate = '';

  days: DayPlan[] = [
    {
      id: 1,
      dayNumber: 1,
      destination: '',
      attractions: [''],
      mealPlan: 'BB',
      accommodation: '',
      expanded: true
    }
  ];

  mealPlanOptions: SelectOption[] = [
    { value: 'BB', label: 'Bed & Breakfast (BB)' },
    { value: 'HB', label: 'Half Board (HB)' },
    { value: 'FB', label: 'Full Board (FB)' },
    { value: 'AI', label: 'All Inclusive (AI)' }
  ];

  accommodationOptions: SelectOption[] = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' }
  ];

  toggleDay(day: DayPlan): void {
    day.expanded = !day.expanded;
  }

  addDay(): void {
    const newDay: DayPlan = {
      id: this.days.length + 1,
      dayNumber: this.days.length + 1,
      destination: '',
      attractions: [''],
      mealPlan: 'BB',
      accommodation: '',
      expanded: true
    };
    this.days.push(newDay);
  }

  removeDay(id: number): void {
    if (this.days.length > 1) {
      this.days = this.days.filter(d => d.id !== id);
      // Renumber days
      this.days.forEach((day, index) => {
        day.dayNumber = index + 1;
      });
    }
  }

  addAttraction(day: DayPlan): void {
    day.attractions.push('');
  }

  removeAttraction(day: DayPlan, index: number): void {
    day.attractions.splice(index, 1);
  }

  handleSaveDraft(): void {
    this.toastService.success('Itinerary saved as draft');
  }

  handleSubmit(): void {
    this.toastService.success('Itinerary submitted for review');
    setTimeout(() => this.router.navigate(['/guest/dashboard']), 1500);
  }
}
