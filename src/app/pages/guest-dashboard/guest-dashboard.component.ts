import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ItineraryService } from '../../services/itinerary.service';
import { ToastService } from '../../services/toast.service';
import type { GuestItineraryRow, ItineraryMessage } from '../../models/itinerary.models';
import { ItineraryCardComponent } from '../../components/itinerary-card/itinerary-card.component';
import { ConversationModalComponent } from '../../components/conversation-modal/conversation-modal.component';

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
    IconComponent,
    ItineraryCardComponent,
    ConversationModalComponent
  ],
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.scss']
})
export class GuestDashboardComponent {
  private router = inject(Router);
  private itineraryService = inject(ItineraryService);
  private toastService = inject(ToastService);

  itineraries: GuestItineraryRow[] = [];
  isLoading = false;
  errorMessage = '';
  busyItineraryIds = new Set<number>();
  conversationOpen = false;
  conversationItineraryId: number | null = null;
  messages: ItineraryMessage[] = [];

  async ngOnInit() {
    await this.refresh();
  }

  private normalizeStatus(status: string): string {
    return String(status ?? '').toLowerCase();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.itineraries = await this.itineraryService.getGuestItineraries();
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load your itineraries.';
    } finally {
      this.isLoading = false;
    }
  }

  get draftItineraries(): GuestItineraryRow[] {
    return this.itineraries.filter(i => this.normalizeStatus(i.status) === 'draft');
  }

  get submittedItineraries(): GuestItineraryRow[] {
    return this.itineraries.filter(i => this.normalizeStatus(i.status) === 'submitted');
  }

  get correctedItineraries(): GuestItineraryRow[] {
    return this.itineraries.filter(i => ['returned', 'returned_for_correction', 'corrected', 'resubmitted'].includes(this.normalizeStatus(i.status)));
  }

  get approvedItineraries(): GuestItineraryRow[] {
    const approvedStatuses = new Set(['approved_by_admin', 'approved', 'approved_by_staff', 'priced', 'sent_to_admin', 'confirmed']);
    return this.itineraries.filter(i => approvedStatuses.has(this.normalizeStatus(i.status)));
  }

  getStatusColor(status: string): string {
    const normalized = this.normalizeStatus(status);
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      confirmed: 'bg-purple-100 text-purple-800',
      corrected: 'bg-red-100 text-red-800',
      returned: 'bg-red-100 text-red-800',
      returned_for_correction: 'bg-red-100 text-red-800',
      resubmitted: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800'
    };
    if (normalized === 'approved_by_staff' || normalized === 'approved_by_admin') return colors['approved'];
    if (normalized === 'requested_changes') return colors['corrected'];
    if (normalized === 'priced') return 'bg-orange-100 text-orange-800';
    if (normalized === 'sent_to_admin') return 'bg-indigo-100 text-indigo-800';
    if (normalized === 'under_review') return 'bg-yellow-100 text-yellow-800';
    return colors[normalized] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  formatStatus(status: string): string {
    const s = this.normalizeStatus(status).replace(/_/g, ' ');
    return s.length ? s.replace(/\b\w/g, c => c.toUpperCase()) : status;
  }

  navigateToBuilder(): void {
    this.router.navigate(['/guest/itinerary-builder']);
  }

  navigateToEditItinerary(id: number): void {
    const base = this.router.url.includes('/traveler/') ? '/traveler' : '/guest';
    this.router.navigate([`${base}/itinerary-builder`, id]);
  }

  navigateToBooking(id: number): void {
    this.router.navigate(['/guest/booking', id]);
  }

  async submitItinerary(id: number, event?: Event): Promise<void> {
    event?.stopPropagation();
    if (this.busyItineraryIds.has(id)) return;

    this.busyItineraryIds.add(id);
    try {
      await this.itineraryService.submitItinerary(id);
      this.toastService.success('Itinerary submitted for review.');
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to submit itinerary.');
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

  async deleteDraft(id: number, event?: Event): Promise<void> {
    event?.stopPropagation();
    if (this.busyItineraryIds.has(id)) return;
    this.busyItineraryIds.add(id);
    try {
      await this.itineraryService.deleteDraftItinerary(id);
      this.toastService.success('Draft deleted.');
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

  async openConversation(itineraryId: number): Promise<void> {
    this.conversationItineraryId = itineraryId;
    this.conversationOpen = true;
    this.messages = await this.itineraryService.getMessages(itineraryId);
  }

  async sendConversationMessage(text: string): Promise<void> {
    if (!this.conversationItineraryId) return;
    await this.itineraryService.addMessage(this.conversationItineraryId, text, 'COMMENT');
    this.messages = await this.itineraryService.getMessages(this.conversationItineraryId);
  }
}
