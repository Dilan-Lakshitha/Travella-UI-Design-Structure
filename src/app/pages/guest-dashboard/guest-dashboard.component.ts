import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ItineraryService } from '../../services/itinerary.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import type { GuestItineraryRow, TravelerDashboardTab } from '../../models/itinerary.models';
import { ItineraryCardComponent } from '../../components/itinerary-card/itinerary-card.component';
import { ConversationModalComponent } from '../../components/conversation-modal/conversation-modal.component';
import {
  canTravelerEditReturned,
  canTravelerOpenConversation,
  isFinalReadOnly,
  itineraryStatusClass,
  itineraryStatusLabel,
  travelerTabForStatus,
} from '../../utils/itinerary-status.util';

interface TravelerTabConfig {
  id: TravelerDashboardTab;
  label: string;
}

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardContentComponent,
    IconComponent,
    ItineraryCardComponent,
    ConversationModalComponent,
  ],
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.scss'],
})
export class GuestDashboardComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private itineraryService = inject(ItineraryService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  readonly tabs: TravelerTabConfig[] = [
    { id: 'draft', label: 'Draft' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'returned', label: 'Returned / Resubmitted' },
    { id: 'approved', label: 'Approved / Confirmed' },
    { id: 'rejected', label: 'Rejected' },
  ];

  activeTab: TravelerDashboardTab = 'draft';
  itineraries: GuestItineraryRow[] = [];
  isLoading = false;
  errorMessage = '';
  busyItineraryIds = new Set<number>();

  conversationOpen = false;
  conversationItineraryId: number | null = null;

  readonly statusLabel = itineraryStatusLabel;
  readonly statusClass = itineraryStatusClass;

  async ngOnInit(): Promise<void> {
    await this.refresh();
    await this.openConversationFromQuery();
  }

  private async openConversationFromQuery(): Promise<void> {
    const id = Number(this.route.snapshot.queryParamMap.get('openConversation'));
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }

    this.openConversation(id);
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { openConversation: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  normalizeStatus(row: GuestItineraryRow): string {
    return String(row.rawStatus ?? row.status ?? '').toLowerCase().trim();
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

  selectTab(tab: TravelerDashboardTab): void {
    this.activeTab = tab;
  }

  itemsForActiveTab(): GuestItineraryRow[] {
    return this.itineraries.filter((i) => travelerTabForStatus(this.normalizeStatus(i)) === this.activeTab);
  }

  get returnedCount(): number {
    return this.itineraries.filter((i) => travelerTabForStatus(this.normalizeStatus(i)) === 'returned').length;
  }

  get submittedCount(): number {
    return this.itineraries.filter((i) => travelerTabForStatus(this.normalizeStatus(i)) === 'submitted').length;
  }

  get approvedCount(): number {
    return this.itineraries.filter((i) => travelerTabForStatus(this.normalizeStatus(i)) === 'approved').length;
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  }

  navigateToBuilder(): void {
    const base = this.router.url.includes('/traveler/') ? '/traveler' : '/guest';
    this.router.navigate([`${base}/itinerary-builder`]);
  }

  navigateToEditItinerary(id: number): void {
    const base = this.router.url.includes('/traveler/') ? '/traveler' : '/guest';
    this.router.navigate([`${base}/itinerary-builder`, id]);
  }

  navigateToBooking(id: number): void {
    const base = this.router.url.includes('/traveler/') ? '/traveler' : '/guest';
    this.router.navigate([`${base}/booking`, id]);
  }

  canEditReturned(row: GuestItineraryRow): boolean {
    return canTravelerEditReturned(this.normalizeStatus(row));
  }

  canViewConversation(row: GuestItineraryRow): boolean {
    return canTravelerOpenConversation(this.normalizeStatus(row));
  }

  isReadOnlyFinal(row: GuestItineraryRow): boolean {
    return isFinalReadOnly(this.normalizeStatus(row));
  }

  notificationText(row: GuestItineraryRow): string | null {
    const status = this.normalizeStatus(row);
    if (status === 'returned_for_correction') return 'Action needed: update your itinerary and resubmit.';
    if (status === 'resubmitted') return 'Resubmitted — waiting for staff review.';
    if (status === 'approved_by_admin') return 'Your trip has been approved by the owner.';
    if (status === 'confirmed') return 'Your trip is confirmed.';
    if (status === 'rejected') return 'This itinerary was rejected.';
    if (status === 'under_review') return 'Your itinerary is being reviewed.';
    return null;
  }

  async submitItinerary(id: number, event?: Event): Promise<void> {
    event?.stopPropagation();
    if (this.busyItineraryIds.has(id)) return;

    const row = this.itineraries.find((i) => i.id === id);
    const isReturned = row && this.normalizeStatus(row) === 'returned_for_correction';

    this.busyItineraryIds.add(id);
    try {
      if (isReturned) {
        await this.itineraryService.resubmitItinerary(id);
        this.toastService.success('Itinerary resubmitted for review.');
      } else {
        await this.itineraryService.submitItinerary(id);
        this.toastService.success('Itinerary submitted for review.');
      }
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
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

  openConversation(itineraryId: number): void {
    this.conversationItineraryId = itineraryId;
    this.conversationOpen = true;
  }

  currentUserId(): number | null {
    return this.authService.getUser()?.userId ?? null;
  }

}
