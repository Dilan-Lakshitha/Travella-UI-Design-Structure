import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { TextareaComponent, LabelComponent } from '../../components/ui/input.component';
import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogDescriptionComponent, DialogFooterComponent } from '../../components/ui/dialog.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';
import { ItineraryService } from '../../services/itinerary.service';
import { AuthService } from '../../services/auth.service';
import { ConversationModalComponent } from '../../components/conversation-modal/conversation-modal.component';
import type { AgencyReviewRow, AssignReviewerResult, ItineraryDto, StaffItineraryTab } from '../../models/itinerary.models';
import {
  canStaffOpenConversation,
  canStaffPerformReviewActions,
  canStaffReturnForCorrection,
  canStaffStartPricing,
  isResubmitted,
  itineraryStatusClass,
  itineraryStatusLabel,
} from '../../utils/itinerary-status.util';

interface DayDetail {
  day: number;
  destination: string;
  attractions: string[];
  mealPlan: string;
  accommodation: string;
}

interface StaffTabConfig {
  id: StaffItineraryTab;
  label: string;
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
    IconComponent,
    ConversationModalComponent,
  ],
  templateUrl: './agency-review.component.html',
  styleUrls: ['./agency-review.component.scss']
})
export class AgencyReviewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private itineraryService = inject(ItineraryService);
  private authService = inject(AuthService);

  readonly tabs: StaffTabConfig[] = [
    { id: 'pending', label: 'Pending Review' },
    { id: 'in-review', label: 'In Review' },
    { id: 'returned', label: 'Returned / Resubmitted' },
    { id: 'priced', label: 'Priced' },
    { id: 'approved', label: 'Approved' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
  ];

  activeTab: StaffItineraryTab = 'pending';
  itineraries: AgencyReviewRow[] = [];
  tabLoading = false;
  tabError = '';

  isDialogOpen = false;
  selectedItinerary: AgencyReviewRow | null = null;
  reviewNotes = '';
  correctionNotes = '';
  itineraryDetails: DayDetail[] = [];
  busyItineraryIds = new Set<number>();
  dialogLoading = false;

  conversationOpen = false;
  conversationItineraryId: number | null = null;
  conversationReadOnlyHint = '';
  private lastAssignmentResult: AssignReviewerResult | null = null;

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  }

  async ngOnInit(): Promise<void> {
    await this.loadTab(this.activeTab);
    await this.openConversationFromQuery();
  }

  private async openConversationFromQuery(): Promise<void> {
    const id = Number(this.route.snapshot.queryParamMap.get('openConversation'));
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }

    let review = this.itineraries.find((r) => r.id === id);
    if (!review) {
      this.activeTab = 'returned';
      await this.loadTab('returned');
      review = this.itineraries.find((r) => r.id === id);
    }

    if (review && this.canShowConversation(review)) {
      this.openConversation(review);
    }

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { openConversation: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  async selectTab(tab: StaffItineraryTab): Promise<void> {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    await this.loadTab(tab);
  }

  async loadTab(tab: StaffItineraryTab): Promise<void> {
    this.tabLoading = true;
    this.tabError = '';
    try {
      this.itineraries = await this.itineraryService.getStaffItinerariesByTab(tab);
    } catch (e) {
      console.error(e);
      this.itineraries = [];
      this.tabError = this.itineraryService.readApiError(e) || 'Failed to load itineraries.';
    } finally {
      this.tabLoading = false;
    }
  }

  normalizeStatus(review: AgencyReviewRow): string {
    return String(review.rawStatus ?? review.status ?? '').toLowerCase().trim();
  }

  getStatusLabel(review: AgencyReviewRow): string {
    return itineraryStatusLabel(this.normalizeStatus(review));
  }

  getStatusClass(review: AgencyReviewRow): string {
    return itineraryStatusClass(this.normalizeStatus(review));
  }

  canShowConversation(review: AgencyReviewRow): boolean {
    return canStaffOpenConversation(this.normalizeStatus(review));
  }

  private shouldAssignReviewer(status: string): boolean {
    return status === 'submitted' || status === 'under_review';
  }

  isReturnedTab(): boolean {
    return this.activeTab === 'returned';
  }

  canShowReturnedTabActions(review: AgencyReviewRow): boolean {
    return this.isReturnedTab() && isResubmitted(this.normalizeStatus(review));
  }

  private applyAssignmentToRow(review: AgencyReviewRow, result: AssignReviewerResult): void {
    review.status = result.status;
    review.rawStatus = result.status;
    this.lastAssignmentResult = result;
    this.conversationReadOnlyHint = this.buildConversationReadOnlyHint(result);
  }

  private buildConversationReadOnlyHint(result: AssignReviewerResult | null): string {
    if (result && !result.isCurrentUserReviewer && result.assignedReviewerId) {
      return 'This itinerary is currently being reviewed by another staff member.';
    }
    return 'This conversation is read-only for your account.';
  }

  async ensureReviewerAssigned(review: AgencyReviewRow): Promise<AssignReviewerResult | null> {
    const status = this.normalizeStatus(review);
    if (!this.shouldAssignReviewer(status)) {
      return null;
    }

    const result = await this.itineraryService.assignReviewer(review.id);
    this.applyAssignmentToRow(review, result);

    const staysInReturnedQueue =
      this.activeTab === 'returned' &&
      (this.normalizeStatus(review) === 'resubmitted' || result.status === 'resubmitted');

    if ((result.reviewerAssignedByThisRequest || result.status === 'under_review') && !staysInReturnedQueue) {
      await this.loadTab(this.activeTab);
    }

    if (!result.isCurrentUserReviewer && result.assignedReviewerId) {
      this.toastService.info('This itinerary is assigned to another reviewer.');
    }

    return result;
  }

  openConversation(review: AgencyReviewRow): void {
    if (!this.canShowConversation(review)) {
      return;
    }

    this.conversationReadOnlyHint = '';
    this.conversationItineraryId = review.id;
    this.conversationOpen = true;
  }

  currentUserId(): number | null {
    return this.authService.getUser()?.userId ?? null;
  }

  isReadOnly(review: AgencyReviewRow): boolean {
    const status = this.normalizeStatus(review);
    return status === 'approved_by_admin' || status === 'confirmed';
  }

  canShowReviewDetails(review: AgencyReviewRow): boolean {
    return canStaffPerformReviewActions(this.normalizeStatus(review));
  }

  canShowCreatePricing(review: AgencyReviewRow): boolean {
    return canStaffStartPricing(this.normalizeStatus(review));
  }

  canShowReturnForCorrection(review: AgencyReviewRow): boolean {
    return canStaffReturnForCorrection(this.normalizeStatus(review));
  }

  shouldShowViewDetails(review: AgencyReviewRow): boolean {
    if (this.isReadOnly(review)) {
      return true;
    }
    return !canStaffPerformReviewActions(this.normalizeStatus(review));
  }

  canShowDialogActions(review: AgencyReviewRow | null): boolean {
    if (!review) return false;
    return canStaffPerformReviewActions(this.normalizeStatus(review));
  }

  isResubmittedReview(review: AgencyReviewRow): boolean {
    return isResubmitted(this.normalizeStatus(review));
  }

  openReviewDialog(review: AgencyReviewRow): void {
    this.selectedItinerary = review;
    this.reviewNotes = '';
    this.correctionNotes = '';
    this.itineraryDetails = [];
    this.isDialogOpen = true;
  }

  async openReviewDialogWithDetails(review: AgencyReviewRow): Promise<void> {
    this.openReviewDialog(review);
    this.dialogLoading = true;
    try {
      if (!isResubmitted(this.normalizeStatus(review))) {
        await this.ensureReviewerAssigned(review);
      }

      const itinerary: ItineraryDto = await this.itineraryService.getItinerary(review.id);
      this.itineraryDetails = (itinerary.days ?? []).map((d) => ({
        day: d.dayNumber,
        destination: d.overnightLocation,
        attractions: (d.attractions ?? []).map((a) => a.name),
        mealPlan: d.mealPlanCode ?? '',
        accommodation: d.accommodationType ?? '',
      }));
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.dialogLoading = false;
    }
  }

  async openReadOnlyDetails(review: AgencyReviewRow): Promise<void> {
    this.openReviewDialog(review);
    this.dialogLoading = true;
    try {
      const itinerary: ItineraryDto = await this.itineraryService.getItinerary(review.id);
      this.itineraryDetails = (itinerary.days ?? []).map((d) => ({
        day: d.dayNumber,
        destination: d.overnightLocation,
        attractions: (d.attractions ?? []).map((a) => a.name),
        mealPlan: d.mealPlanCode ?? '',
        accommodation: d.accommodationType ?? '',
      }));
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.dialogLoading = false;
    }
  }

  async handleApprove(id: number): Promise<void> {
    if (this.busyItineraryIds.has(id)) return;
    this.busyItineraryIds.add(id);
    try {
      const row = this.itineraries.find((r) => r.id === id) ?? this.selectedItinerary;
      const wasResubmitted = row ? isResubmitted(this.normalizeStatus(row)) : false;
      const result = await this.itineraryService.assignReviewer(id);
      if (!result.isCurrentUserReviewer) {
        this.toastService.error('This itinerary is already assigned to another reviewer.');
        return;
      }
      this.toastService.success(wasResubmitted ? 'Continuing to pricing.' : 'Itinerary is now under review.');
      this.isDialogOpen = false;
      this.router.navigate(['/agency/pricing', id]);
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

  goToPricing(id: number): void {
    this.router.navigate(['/agency/pricing', id]);
  }

  async handleReturnForCorrection(): Promise<void> {
    if (!this.selectedItinerary) return;
    const id = this.selectedItinerary.id;
    if (this.busyItineraryIds.has(id)) return;
    this.busyItineraryIds.add(id);
    try {
      await this.itineraryService.returnItineraryForCorrection(
        id,
        this.correctionNotes || this.reviewNotes || '',
      );
      this.toastService.info('Correction request sent to guest');
      this.isDialogOpen = false;
      this.selectedItinerary = null;
      this.correctionNotes = '';
      this.reviewNotes = '';
      this.activeTab = 'returned';
      await this.loadTab('returned');
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e) || 'Failed to return itinerary for correction.');
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
      await this.loadTab(this.activeTab);
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to reject itinerary');
    } finally {
      this.busyItineraryIds.delete(id);
    }
  }

}
