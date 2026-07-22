import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
} from '../../components/ui/card.component';
import { IconComponent } from '../../components/ui/icons.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { ToastService } from '../../services/toast.service';
import { ItineraryService } from '../../services/itinerary.service';
import type { AdminDashboardResponse, AdminDashboardTab, AgencyReviewRow } from '../../models/itinerary.models';
import {
  canStaffOpenConversation,
  canStaffReturnForCorrection,
  itineraryStatusClass,
  itineraryStatusLabel,
  isResubmitted,
} from '../../utils/itinerary-status.util';
import { ConversationModalComponent } from '../../components/conversation-modal/conversation-modal.component';
import { AuthService } from '../../services/auth.service';
import { AdminBookingCalendarComponent } from '../../components/admin-booking-calendar/admin-booking-calendar.component';

interface TabConfig {
  id: AdminDashboardTab;
  label: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    IconComponent,
    BadgeComponent,
    AdminBookingCalendarComponent,
    ConversationModalComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private itineraryService = inject(ItineraryService);
  private authService = inject(AuthService);

  conversationOpen = false;
  conversationItineraryId: number | null = null;
  readonly tabs: TabConfig[] = [
    { id: 'all', label: 'All' },
    { id: 'pending-review', label: 'Pending Review' },
    { id: 'in-review', label: 'In Review' },
    { id: 'returned', label: 'Returned / Resubmitted' },
    { id: 'priced', label: 'Priced' },
    { id: 'awaiting-approval', label: 'Sent to Owner' },
    { id: 'approved', label: 'Approved' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'rejected', label: 'Rejected' },
  ];

  readonly statusChips = [
    { key: 'draft', label: 'Draft' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_review', label: 'In Review' },
    { key: 'returned_for_correction', label: 'Returned' },
    { key: 'resubmitted', label: 'Resubmitted' },
    { key: 'priced', label: 'Priced' },
    { key: 'sent_to_admin', label: 'Awaiting Approval' },
    { key: 'approved_by_admin', label: 'Approved' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'rejected', label: 'Rejected' },
  ];

  dashboard: AdminDashboardResponse | null = null;
  activeTab: AdminDashboardTab = 'all';
  showCalendar = false;
  isLoading = false;
  errorMessage = '';
  busyIds = new Set<number>();

  get approvedCount(): number {
    return this.dashboard?.statusCounts?.['approved_by_admin'] ?? 0;
  }

  get activeItineraries(): AgencyReviewRow[] {
    if (!this.dashboard) return [];
    const sections = this.dashboard.sections;
    switch (this.activeTab) {
      case 'pending-review':
        return sections.pendingReview;
      case 'in-review':
        return sections.inReview;
      case 'returned':
        return sections.returned;
      case 'priced':
        return sections.priced;
      case 'awaiting-approval':
        return sections.awaitingApproval;
      case 'approved':
        return sections.approved;
      case 'confirmed':
        return sections.confirmed;
      case 'rejected':
        return sections.rejected;
      default:
        return sections.all;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.dashboard = await this.itineraryService.getAdminDashboard();
    } catch (e) {
      console.error(e);
      this.errorMessage = this.itineraryService.readApiError(e) || 'Failed to load admin dashboard.';
    } finally {
      this.isLoading = false;
    }
  }

  selectTab(tab: AdminDashboardTab): void {
    this.activeTab = tab;
  }

  tabCount(tab: AdminDashboardTab): number {
    if (!this.dashboard) return 0;
    const sections = this.dashboard.sections;
    switch (tab) {
      case 'pending-review':
        return sections.pendingReview.length;
      case 'in-review':
        return sections.inReview.length;
      case 'returned':
        return sections.returned.length;
      case 'priced':
        return sections.priced.length;
      case 'awaiting-approval':
        return sections.awaitingApproval.length;
      case 'approved':
        return sections.approved.length;
      case 'confirmed':
        return sections.confirmed.length;
      case 'rejected':
        return sections.rejected.length;
      default:
        return sections.all.length;
    }
  }

  statusCount(key: string): number {
    return this.dashboard?.statusCounts?.[key] ?? 0;
  }

  normalizeStatus(row: AgencyReviewRow): string {
    return String(row.rawStatus ?? row.status ?? '')
      .toLowerCase()
      .trim();
  }

  getStatusLabel(row: AgencyReviewRow): string {
    return itineraryStatusLabel(this.normalizeStatus(row));
  }

  getStatusClass(row: AgencyReviewRow): string {
    return itineraryStatusClass(this.normalizeStatus(row));
  }

  statusChipBorderClass(key: string): string {
    const borders: Record<string, string> = {
      draft: 'border-l-gray-400',
      submitted: 'border-l-blue-500',
      under_review: 'border-l-yellow-500',
      returned_for_correction: 'border-l-orange-500',
      resubmitted: 'border-l-orange-400',
      priced: 'border-l-purple-500',
      sent_to_admin: 'border-l-teal-500',
      approved_by_admin: 'border-l-green-500',
      confirmed: 'border-l-green-800',
      rejected: 'border-l-red-500',
    };
    return borders[key] ?? 'border-l-gray-300';
  }

  statusChipBadgeClass(key: string): string {
    return itineraryStatusClass(key);
  }

  rowPrice(row: AgencyReviewRow): number {
    return Number(row.pricing?.totalAmount ?? row.totalPrice ?? 0);
  }

  pricingSummary(row: AgencyReviewRow): string | null {
    const p = row.pricing;
    if (!p) return null;
    return `Driver ${p.driverCost} · Guide ${p.guideCost} · Vehicle ${p.vehicleCost} · Margin ${p.profitMargin}%`;
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  }

  canReview(row: AgencyReviewRow): boolean {
    const s = this.normalizeStatus(row);
    return s === 'submitted' || s === 'under_review';
  }

  canOpenPricing(row: AgencyReviewRow): boolean {
    const s = this.normalizeStatus(row);
    return ['under_review', 'priced', 'sent_to_admin', 'approved_by_admin'].includes(s);
  }

  canReturnedTabContinue(row: AgencyReviewRow): boolean {
    return this.activeTab === 'returned' && isResubmitted(this.normalizeStatus(row));
  }

  canReturnForCorrection(row: AgencyReviewRow): boolean {
    return canStaffReturnForCorrection(this.normalizeStatus(row));
  }

  canShowConversation(row: AgencyReviewRow): boolean {
    return canStaffOpenConversation(this.normalizeStatus(row));
  }

  openConversation(itineraryId: number): void {
    this.conversationItineraryId = itineraryId;
    this.conversationOpen = true;
  }

  currentUserId(): number | null {
    return this.authService.getUser()?.userId ?? null;
  }

  canApproveFinal(row: AgencyReviewRow): boolean {
    return this.normalizeStatus(row) === 'sent_to_admin';
  }

  canConfirm(row: AgencyReviewRow): boolean {
    return this.normalizeStatus(row) === 'approved_by_admin';
  }

  canReject(row: AgencyReviewRow): boolean {
    const s = this.normalizeStatus(row);
    return s !== 'rejected' && s !== 'confirmed';
  }

  canUpdateMargin(row: AgencyReviewRow): boolean {
    const s = this.normalizeStatus(row);
    return s === 'approved_by_admin' || s === 'sent_to_admin';
  }

  goToAgencyReview(): void {
    this.router.navigate(['/agency/review']);
  }

  goToPricing(id: number): void {
    this.router.navigate(['/agency/pricing', id]);
  }

  async returnForCorrection(itineraryId: number): Promise<void> {
    const message = prompt('Correction notes for the traveler:');
    if (message == null) return;
    if (this.busyIds.has(itineraryId)) return;
    this.busyIds.add(itineraryId);
    try {
      await this.itineraryService.requestCorrection(itineraryId, message);
      this.toastService.info('Returned for correction.');
      await this.refresh();
    } catch (e) {
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.busyIds.delete(itineraryId);
    }
  }

  async approveFinal(itineraryId: number): Promise<void> {
    if (this.busyIds.has(itineraryId)) return;
    this.busyIds.add(itineraryId);
    try {
      await this.itineraryService.adminApprove(itineraryId);
      this.toastService.success('Itinerary approved.');
      await this.refresh();
    } catch (e) {
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.busyIds.delete(itineraryId);
    }
  }

  async confirm(itineraryId: number): Promise<void> {
    if (this.busyIds.has(itineraryId)) return;
    this.busyIds.add(itineraryId);
    try {
      await this.itineraryService.confirmItinerary(itineraryId);
      this.toastService.success('Itinerary confirmed. Staff availability locked and notification emails sent.');
      await this.refresh();
    } catch (e) {
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.busyIds.delete(itineraryId);
    }
  }

  async reject(itineraryId: number): Promise<void> {
    if (this.busyIds.has(itineraryId)) return;
    this.busyIds.add(itineraryId);
    try {
      await this.itineraryService.adminReject(itineraryId);
      this.toastService.error('Itinerary rejected.');
      await this.refresh();
    } catch (e) {
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.busyIds.delete(itineraryId);
    }
  }

  async updateMargin(itineraryId: number): Promise<void> {
    const value = prompt('Enter new profit margin (%)');
    if (value == null) return;
    const margin = Number(value);
    if (!Number.isFinite(margin)) {
      this.toastService.error('Invalid margin value.');
      return;
    }
    try {
      await this.itineraryService.updatePricingMargin(itineraryId, margin);
      this.toastService.success('Margin updated.');
      await this.refresh();
    } catch (e) {
      this.toastService.error(this.itineraryService.readApiError(e));
    }
  }
}
