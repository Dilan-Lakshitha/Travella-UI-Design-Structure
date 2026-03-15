import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { SelectComponent, SelectOption } from '../../components/ui/select.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pricing-assignment',
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
    IconComponent
  ],
  template: `
    <app-layout title="Pricing & Staff Assignment" role="agency">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Trip Summary -->
        <app-card>
          <app-card-header>
            <app-card-title>Trip Summary</app-card-title>
          </app-card-header>
          <app-card-content>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Trip:</span> European Adventure
              </div>
              <div>
                <span class="text-gray-600">Guest:</span> John Doe
              </div>
              <div>
                <span class="text-gray-600">Duration:</span> 10 days
              </div>
              <div>
                <span class="text-gray-600">Dates:</span> Mar 15 - Mar 25, 2026
              </div>
            </div>
          </app-card-content>
        </app-card>

        <!-- Pricing Breakdown -->
        <app-card>
          <app-card-header>
            <app-card-title class="flex items-center">
              <app-icon name="dollar-sign" [size]="20" class="mr-2" />
              Pricing Breakdown
            </app-card-title>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <app-label for="vehicle">
                  <app-icon name="car" [size]="16" class="inline mr-2" />
                  Vehicle Cost (Auto-calculated)
                </app-label>
                <app-input
                  id="vehicle"
                  type="number"
                  [(ngModel)]="vehicleCost"
                />
              </div>

              <div class="space-y-2">
                <app-label for="driver">
                  <app-icon name="user-check" [size]="16" class="inline mr-2" />
                  Driver Fee
                </app-label>
                <app-input
                  id="driver"
                  type="number"
                  [(ngModel)]="driverFee"
                />
              </div>

              <div class="space-y-2">
                <app-label for="guide">
                  <app-icon name="user-check" [size]="16" class="inline mr-2" />
                  Guide Fee
                </app-label>
                <app-input
                  id="guide"
                  type="number"
                  [(ngModel)]="guideFee"
                />
              </div>

              <div class="space-y-2">
                <app-label for="accommodation">
                  <app-icon name="home" [size]="16" class="inline mr-2" />
                  Accommodation Cost
                </app-label>
                <app-input
                  id="accommodation"
                  type="number"
                  [(ngModel)]="accommodationCost"
                />
              </div>

              <div class="space-y-2">
                <app-label for="adultTickets">
                  <app-icon name="ticket" [size]="16" class="inline mr-2" />
                  Adult Tickets
                </app-label>
                <app-input
                  id="adultTickets"
                  type="number"
                  [(ngModel)]="adultTickets"
                />
              </div>

              <div class="space-y-2">
                <app-label for="childTickets">
                  <app-icon name="ticket" [size]="16" class="inline mr-2" />
                  Child Tickets
                </app-label>
                <app-input
                  id="childTickets"
                  type="number"
                  [(ngModel)]="childTickets"
                />
              </div>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold">Total Package Cost:</span>
                <span class="text-2xl font-bold text-blue-600">
                  {{ '$' + calculateTotal().toFixed(2) }}
                </span>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <!-- Staff Assignment -->
        <app-card>
          <app-card-header>
            <app-card-title>Staff Assignment</app-card-title>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="space-y-2">
              <app-label for="assignDriver">Assign Driver</app-label>
              <app-select
                id="assignDriver"
                [(ngModel)]="selectedDriver"
                [options]="driverOptions"
                placeholder="Select a driver"
              />
            </div>

            <div class="space-y-2">
              <app-label for="assignGuide">Assign Guide</app-label>
              <app-select
                id="assignGuide"
                [(ngModel)]="selectedGuide"
                [options]="guideOptions"
                placeholder="Select a guide"
              />
            </div>

            @if (selectedDriver && selectedGuide) {
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-sm text-green-800">
                  <strong>Assigned Staff:</strong>
                  <br />
                  Driver: {{ getDriverName(selectedDriver) }}
                  <br />
                  Guide: {{ getGuideName(selectedGuide) }}
                </p>
              </div>
            }
          </app-card-content>
        </app-card>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button class="btn btn-outline">
            <app-icon name="save" [size]="16" class="mr-2" />
            Save Draft
          </button>
          <button class="btn btn-primary" (click)="handleGeneratePackage()">
            <app-icon name="send" [size]="16" class="mr-2" />
            Generate Package & Send to Guest
          </button>
        </div>
      </div>
    </app-layout>
  `
})
export class PricingAssignmentComponent {
  @Input() id = '';
  
  private router = inject(Router);
  private toastService = inject(ToastService);

  vehicleCost = 1200;
  driverFee = 500;
  guideFee = 800;
  accommodationCost = 2400;
  adultTickets = 300;
  childTickets = 150;
  selectedDriver = '';
  selectedGuide = '';

  driverOptions: SelectOption[] = [
    { value: '1', label: 'Michael Chen' },
    { value: '2', label: 'Sarah Williams' },
    { value: '3', label: 'James Brown', disabled: true },
  ];

  guideOptions: SelectOption[] = [
    { value: '1', label: 'Emma Thompson - English, French' },
    { value: '2', label: 'Carlos Rodriguez - English, Spanish' },
    { value: '3', label: 'Yuki Tanaka - English, Japanese', disabled: true },
  ];

  calculateTotal(): number {
    return (
      (this.vehicleCost || 0) +
      (this.driverFee || 0) +
      (this.guideFee || 0) +
      (this.accommodationCost || 0) +
      (this.adultTickets || 0) +
      (this.childTickets || 0)
    );
  }

  getDriverName(id: string): string {
    const driver = this.driverOptions.find(d => d.value === id);
    return driver?.label || '';
  }

  getGuideName(id: string): string {
    const guide = this.guideOptions.find(g => g.value === id);
    return guide?.label || '';
  }

  handleGeneratePackage(): void {
    if (!this.selectedDriver || !this.selectedGuide) {
      this.toastService.error('Please assign both driver and guide');
      return;
    }
    this.toastService.success('Package generated successfully');
    setTimeout(() => this.router.navigate(['/agency/review']), 1500);
  }
}
