import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';
import { ItineraryService } from '../../services/itinerary.service';
import type { ItineraryDto } from '../../models/itinerary.models';

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
    IconComponent
  ],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent {
  @Input() id = '';
  
  private router = inject(Router);
  private toastService = inject(ToastService);
  private itineraryService = inject(ItineraryService);

  itinerary: ItineraryDto | null = null;
  isLoading = false;
  errorMessage = '';
  isSubmitting = false;

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    const itineraryId = Number(this.id);
    if (!Number.isFinite(itineraryId) || itineraryId <= 0) {
      this.errorMessage = 'Invalid itinerary id.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.itinerary = await this.itineraryService.getItinerary(itineraryId);
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load itinerary.';
    } finally {
      this.isLoading = false;
    }
  }

  async handleConfirmBooking(): Promise<void> {
    const itineraryId = Number(this.id);
    if (!Number.isFinite(itineraryId) || itineraryId <= 0) return;
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      await this.itineraryService.confirmItinerary(itineraryId);
      this.toastService.success('Itinerary confirmed.');
      await this.refresh();
      setTimeout(() => this.router.navigate(['/guest/dashboard']), 1000);
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to confirm itinerary.');
    } finally {
      this.isSubmitting = false;
    }
  }

}
