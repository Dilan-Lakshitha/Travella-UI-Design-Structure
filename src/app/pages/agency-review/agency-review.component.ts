import { Component, inject, OnInit } from '@angular/core';
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
import { ItineraryService } from '../../services/itinerary.service';
import type { AgencyReviewRow, ItineraryDto, ItineraryMessage } from '../../models/itinerary.models';

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
  templateUrl: './agency-review.component.html',
  styleUrls: ['./agency-review.component.scss']
})
export class AgencyReviewComponent implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private itineraryService = inject(ItineraryService);

  isDialogOpen = false;
  selectedItinerary: AgencyReviewRow | null = null;
  reviewNotes = '';
  correctionNotes = '';

  pendingReviews: AgencyReviewRow[] = [];
  itineraryDetails: DayDetail[] = [];
  isLoading = false;
  errorMessage = '';
  busyItineraryIds = new Set<number>();
  messages: ItineraryMessage[] = [];

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  async ngOnInit() {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.pendingReviews = await this.itineraryService.getStaffReviewQueue();
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load review queue.';
    } finally {
      this.isLoading = false;
    }
  }

  openReviewDialog(review: AgencyReviewRow): void {
    this.selectedItinerary = review;
    this.isDialogOpen = true;
  }

  async handleApprove(id: number): Promise<void> {
    if (this.busyItineraryIds.has(id)) return;
    this.busyItineraryIds.add(id);
    try {
      await this.itineraryService.startReview(id);
      this.toastService.success('Itinerary is now under review.');
      this.isDialogOpen = false;
      this.router.navigate(['/agency/pricing', id]);
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to approve itinerary');
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

  async handleReturnForCorrection(): Promise<void> {
    if (!this.selectedItinerary) return;
    const id = this.selectedItinerary.id;
    if (this.busyItineraryIds.has(id)) return;
    this.busyItineraryIds.add(id);
    try {
      await this.itineraryService.requestCorrection(id, this.correctionNotes || this.reviewNotes || '');

      this.toastService.info('Correction request sent to guest');
      this.isDialogOpen = false;
      this.selectedItinerary = null;
      this.correctionNotes = '';
      this.reviewNotes = '';
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to request changes');
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

  async handleReject(): Promise<void> {
    if (!this.selectedItinerary) return;
    const id = this.selectedItinerary.id;
    if (this.busyItineraryIds.has(id)) return;
    this.busyItineraryIds.add(id);
    try {
      await this.itineraryService.rejectItinerary(id);
      this.toastService.error('Itinerary rejected');
      this.isDialogOpen = false;
      this.selectedItinerary = null;
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to reject itinerary');
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

  async openReviewDialogWithDetails(review: AgencyReviewRow): Promise<void> {
    this.openReviewDialog(review);
    try {
      await this.itineraryService.startReview(review.id);
      this.messages = await this.itineraryService.getMessages(review.id);
      const itinerary: ItineraryDto = await this.itineraryService.getItinerary(review.id);
      this.itineraryDetails = (itinerary.days ?? []).map((d) => ({
        day: d.dayNumber,
        destination: d.overnightLocation,
        attractions: (d.attractions ?? []).map((a) => a.name),
        mealPlan: (d as any).mealPlanCode ?? '',
        accommodation: (d as any).accommodationType ?? ''
      }));
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    }
  }

  async sendConversationMessage(text: string): Promise<void> {
    if (!this.selectedItinerary) return;
    await this.itineraryService.addMessage(this.selectedItinerary.id, text, 'COMMENT');
    this.messages = await this.itineraryService.getMessages(this.selectedItinerary.id);
  }
}
