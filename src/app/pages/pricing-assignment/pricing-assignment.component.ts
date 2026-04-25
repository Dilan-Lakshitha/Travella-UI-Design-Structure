import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { SelectComponent, SelectOption } from '../../components/ui/select.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';
import { ItineraryService } from '../../services/itinerary.service';
import { StaffService } from '../../services/staff.service';
import type { DriverDto, GuideDto } from '../../models/staff.models';
import type { ItineraryDto, ItineraryPricingPayload } from '../../models/itinerary.models';

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
  templateUrl: './pricing-assignment.component.html',
  styleUrls: ['./pricing-assignment.component.scss']
})
export class PricingAssignmentComponent implements OnInit {
  @Input() id = '';
  
  private router = inject(Router);
  private toastService = inject(ToastService);
  private itineraryService = inject(ItineraryService);
  private staffService = inject(StaffService);

  vehicleCost = 0;
  driverCost = 0;
  guideCost = 0;
  accommodationCost = 0;
  mileageRate = 0;
  totalKm = 0;
  profitMargin = 0;
  mealPlan = 'BB';
  selectedDriver = '';
  selectedGuide = '';

  driverOptions: SelectOption[] = [];
  guideOptions: SelectOption[] = [];

  itinerary: ItineraryDto | null = null;
  isLoading = false;
  errorMessage = '';
  isSubmitting = false;

  async ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    const itineraryId = Number(this.id);
    if (!Number.isFinite(itineraryId) || itineraryId <= 0) {
      this.toastService.error('Invalid itinerary id.');
      this.isLoading = false;
      return;
    }

    try {
      const [itinerary, drivers, guides] = await Promise.all([
        this.itineraryService.getItinerary(itineraryId),
        this.staffService.getDrivers(),
        this.staffService.getGuides()
      ]);

      this.itinerary = itinerary;

      const availableDrivers = await this.itineraryService.getAvailableStaff(
        itinerary.startDate,
        itinerary.endDate,
        'DRIVER',
      );
      const availableGuides = await this.itineraryService.getAvailableStaff(
        itinerary.startDate,
        itinerary.endDate,
        'GUIDE',
      );

      const driverAvailableIds = new Set((availableDrivers ?? []).map((x: any) => Number(x.id)));
      const guideAvailableIds = new Set((availableGuides ?? []).map((x: any) => Number(x.id)));

      this.driverOptions = (drivers ?? []).map((d: DriverDto) => ({
        value: String(d.id),
        label: driverAvailableIds.has(Number(d.id)) ? d.name : `${d.name} (BOOKED)`,
        disabled: !driverAvailableIds.has(Number(d.id)),
      }));

      this.guideOptions = (guides ?? []).map((g: GuideDto) => ({
        value: String(g.id),
        label: guideAvailableIds.has(Number(g.id)) ? g.name : `${g.name} (BOOKED)`,
        disabled: !guideAvailableIds.has(Number(g.id)),
      }));
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load pricing data.';
    } finally {
      this.isLoading = false;
    }
  }

calculateTotal(): number {
  const vehicle = Number(this.vehicleCost) || 0;
  const driver = Number(this.driverCost) || 0;
  const guide = Number(this.guideCost) || 0;
  const accommodation = Number(this.accommodationCost) || 0;
  const mileage = Number(this.mileageRate) || 0;
  const km = Number(this.totalKm) || 0;
  const profit = Number(this.profitMargin) || 0;

  const travelCost = mileage * km;

  const base =
    vehicle +
    driver +
    guide +
    accommodation +
    travelCost;

  const total = base + (base * profit / 100);

  return total;
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

    const itineraryId = Number(this.id);
    if (!Number.isFinite(itineraryId) || itineraryId <= 0) {
      this.toastService.error('Invalid itinerary id.');
      return;
    }

    const totalAmount = this.calculateTotal();
    const pricingPayload: ItineraryPricingPayload = {
      itineraryId,
      driverCost: this.driverCost || 0,
      guideCost: this.guideCost || 0,
      vehicleCost: this.vehicleCost || 0,
      mileageRate: this.mileageRate || 0,
      totalKm: this.totalKm || 0,
      accommodationCost: this.accommodationCost || 0,
      mealPlan: this.mealPlan || 'BB',
      profitMargin: this.profitMargin || 0,
      totalAmount,
    };

    (async () => {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        await this.itineraryService.createPricing(pricingPayload);
        await this.itineraryService.assignDriverGuide(
          itineraryId,
          Number(this.selectedDriver),
          Number(this.selectedGuide),
        );
        await this.itineraryService.sendToAdmin(itineraryId);
        this.toastService.success('Pricing, assignment, and send-to-owner completed.');
        setTimeout(() => this.router.navigate(['/admin/itineraries']), 1000);
      } catch (e) {
        console.error(e);
        this.toastService.error(this.itineraryService.readApiError(e));
      } finally {
        this.isSubmitting = false;
      }
    })();
  }
}
