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
import { AuthService } from '../../services/auth.service';
import type { DriverDto, GuideDto } from '../../models/staff.models';
import type { ItineraryDto, ItineraryPricingDetail, ItineraryPricingPayload } from '../../models/itinerary.models';

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
  private authService = inject(AuthService);

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
  savedPricing: ItineraryPricingDetail | null = null;
  isLoading = false;
  errorMessage = '';
  isSubmitting = false;

  get layoutRole(): 'STAFF' | 'ADMIN' {
    return this.authService.getUser()?.role === 'ADMIN' ? 'ADMIN' : 'STAFF';
  }

  get rawStatus(): string {
    return String(this.itinerary?.rawStatus ?? this.itinerary?.status ?? '').toLowerCase();
  }

  get canEditPricing(): boolean {
    return ['under_review', 'resubmitted',  'priced'].includes(this.rawStatus);
  }

  get canSendToOwner(): boolean {
    return this.rawStatus === 'priced' && !!this.savedPricing;
  }

  get canEditMarginOnly(): boolean {
    return this.layoutRole === 'ADMIN' && ['sent_to_admin', 'approved_by_admin'].includes(this.rawStatus);
  }

  get displayTotal(): number {
    if (this.savedPricing) {
      return Number(this.savedPricing.totalAmount) || 0;
    }
    return this.previewTotal();
  }

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
      const [itinerary, drivers, guides, pricing] = await Promise.all([
        this.itineraryService.getItinerary(itineraryId),
        this.staffService.getDrivers(),
        this.staffService.getGuides(),
        this.itineraryService.getItineraryPricing(itineraryId),
      ]);

      this.itinerary = itinerary;
      this.savedPricing = pricing;
      if (pricing) {
        this.applyPricingToForm(pricing);
      }

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

      this.driverOptions = (drivers ?? []).map((d: DriverDto) => {
        const booked = !driverAvailableIds.has(Number(d.id));
        return {
          value: String(d.id),
          label: booked ? `${d.name} — BOOKED` : d.name,
          disabled: booked,
        };
      });

      this.guideOptions = (guides ?? []).map((g: GuideDto) => {
        const lang = g.language || g.languages;
        const baseName = lang ? `${g.name} (${lang})` : g.name;
        const booked = !guideAvailableIds.has(Number(g.id));
        return {
          value: String(g.id),
          label: booked ? `${baseName} — BOOKED` : baseName,
          disabled: booked,
        };
      });
    } catch (e) {
      console.error(e);
      this.errorMessage = this.itineraryService.readApiError(e) || 'Failed to load pricing data.';
    } finally {
      this.isLoading = false;
    }
  }

  private applyPricingToForm(pricing: ItineraryPricingDetail): void {
    this.vehicleCost = Number(pricing.vehicleCost) || 0;
    this.driverCost = Number(pricing.driverCost) || 0;
    this.guideCost = Number(pricing.guideCost) || 0;
    this.accommodationCost = Number(pricing.accommodationCost) || 0;
    this.mileageRate = Number(pricing.mileageRate) || 0;
    this.totalKm = Number(pricing.totalKm) || 0;
    this.profitMargin = Number(pricing.profitMargin) || 0;
    this.mealPlan = pricing.mealPlan || 'BB';
  }

  previewTotal(): number {
    const travelCost = (Number(this.mileageRate) || 0) * (Number(this.totalKm) || 0);
    const base =
      (Number(this.vehicleCost) || 0) +
      (Number(this.driverCost) || 0) +
      (Number(this.guideCost) || 0) +
      (Number(this.accommodationCost) || 0) +
      travelCost;
    const profit = Number(this.profitMargin) || 0;
    return base + (base * profit) / 100;
  }

  private buildPricingPayload(itineraryId: number): ItineraryPricingPayload {
    return {
      itineraryId,
      driverCost: Number(this.driverCost) || 0,
      guideCost: Number(this.guideCost) || 0,
      vehicleCost: Number(this.vehicleCost) || 0,
      mileageRate: Number(this.mileageRate) || 0,
      totalKm: Number(this.totalKm) || 0,
      accommodationCost: Number(this.accommodationCost) || 0,
      mealPlan: this.mealPlan || 'BB',
      profitMargin: Number(this.profitMargin) || 0,
      totalAmount: 0,
    };
  }

  getDriverName(id: string): string {
    return this.driverOptions.find(d => d.value === id)?.label || '';
  }

  getGuideName(id: string): string {
    return this.guideOptions.find(g => g.value === id)?.label || '';
  }

  async savePricing(): Promise<void> {
    const itineraryId = Number(this.id);
    if (!Number.isFinite(itineraryId) || itineraryId <= 0) {
      this.toastService.error('Invalid itinerary id.');
      return;
    }
    if (!this.canEditPricing) {
      this.toastService.error('Pricing cannot be edited in the current status.');
      return;
    }
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      const saved = await this.itineraryService.createPricing(this.buildPricingPayload(itineraryId));
      this.savedPricing = saved;
      this.applyPricingToForm(saved);
      this.itinerary = await this.itineraryService.getItinerary(itineraryId);
      this.toastService.success('Pricing saved. Itinerary is now priced.');
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.isSubmitting = false;
    }
  }

  async sendToOwner(): Promise<void> {
    if (!this.selectedDriver || !this.selectedGuide) {
      this.toastService.error('Please assign both driver and guide before sending to owner.');
      return;
    }

    const itineraryId = Number(this.id);
    if (!this.canSendToOwner) {
      this.toastService.error('Save pricing first, then send to owner.');
      return;
    }
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      await this.itineraryService.assignDriverGuide(
        itineraryId,
        Number(this.selectedDriver),
        Number(this.selectedGuide),
      );
      await this.itineraryService.sendToAdmin(itineraryId);
      this.toastService.success('Driver and guide assigned. Sent to owner for approval.');
      const target = this.layoutRole === 'ADMIN' ? '/admin/dashboard' : '/agency/review';
      this.router.navigate([target]);
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.isSubmitting = false;
    }
  }

  async updateAdminMargin(): Promise<void> {
    const itineraryId = Number(this.id);
    if (!this.canEditMarginOnly) return;

    this.isSubmitting = true;
    try {
      const updated = await this.itineraryService.updatePricingMargin(itineraryId, Number(this.profitMargin) || 0);
      this.savedPricing = updated;
      this.applyPricingToForm(updated);
      this.toastService.success('Profit margin updated.');
    } catch (e) {
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.isSubmitting = false;
    }
  }
}
