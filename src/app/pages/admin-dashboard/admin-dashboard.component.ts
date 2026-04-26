import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { IconComponent } from '../../components/ui/icons.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { ToastService } from '../../services/toast.service';
import { ItineraryService } from '../../services/itinerary.service';
import { StaffService } from '../../services/staff.service';
import type { CompanyItineraryRow } from '../../models/itinerary.models';

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
    BadgeComponent
  ],
  template: `
    <app-layout title="System Overview" role="ADMIN">
      <div class="space-y-6">
        @if (isLoading) {
          <app-card>
            <app-card-content class="pt-6 text-center text-gray-500">
              Loading company itineraries...
            </app-card-content>
          </app-card>
        }
        @if (!isLoading && errorMessage) {
          <app-card>
            <app-card-content class="pt-6 text-center text-red-600">
              {{ errorMessage }}
            </app-card-content>
          </app-card>
        }

        <!-- Key Metrics -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Total Itineraries</app-card-title>
              <app-icon name="file-text" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">{{ itineraries.length }}</div>
              <p class="text-xs text-muted-foreground">Across all statuses</p>
            </app-card-content>
          </app-card>

          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Pending Admin</app-card-title>
              <app-icon name="clock" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">{{ pendingAdmin.length }}</div>
              <p class="text-xs text-muted-foreground">Sent to admin for decision</p>
            </app-card-content>
          </app-card>

          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Awaiting Confirm</app-card-title>
              <app-icon name="circle-check" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">{{ awaitingConfirm.length }}</div>
              <p class="text-xs text-muted-foreground">Approved by admin</p>
            </app-card-content>
          </app-card>

          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Staff Resources</app-card-title>
              <app-icon name="users" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">{{ staffCount }}</div>
              <p class="text-xs text-muted-foreground">{{ driverCount }} drivers, {{ guideCount }} guides</p>
            </app-card-content>
          </app-card>
        </div>

        <app-card>
          <app-card-header>
            <app-card-title>Submitted itineraries (all agencies)</app-card-title>
            <app-card-description>Every submitted itinerary in the system (owner view)</app-card-description>
          </app-card-header>
          <app-card-content>
            @if (ownerSubmitted.length === 0) {
              <div class="text-center text-gray-500 py-4">No submitted itineraries.</div>
            } @else {
              <div class="space-y-2 max-h-72 overflow-y-auto">
                @for (row of ownerSubmitted; track row.id) {
                  <div class="flex flex-wrap items-center justify-between gap-2 border rounded-md p-3 text-sm">
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ row.tripName }}</div>
                      <div class="text-gray-600 truncate">
                        {{ row.guestName }} · {{ row.destination }} · {{ row.daysCount }} days
                        @if (row.companyId) {
                          <span> · Company #{{ row.companyId }}</span>
                        }
                      </div>
                    </div>
                    <app-badge class="bg-green-100 text-green-800">{{ row.rawStatus }}</app-badge>
                  </div>
                }
              </div>
            }
          </app-card-content>
        </app-card>

        <app-card>
          <app-card-header>
            <app-card-title>Approved Itineraries</app-card-title>
            <app-card-description>Review price and adjust margin before final confirmation.</app-card-description>
          </app-card-header>
          <app-card-content>
            @if (approvedItineraries.length === 0) {
              <div class="text-center text-gray-500 py-4">No approved itineraries.</div>
            } @else {
              <div class="space-y-2">
                @for (row of approvedItineraries; track row.id) {
                  <div class="border rounded-md p-3 flex items-center justify-between gap-2">
                    <div class="text-sm">
                      <div class="font-medium">{{ row.tripName }}</div>
                      <div class="text-gray-600">{{ row.guestName }} · {{ row.destination }}</div>
                      <div class="text-gray-700">Price: {{ row.totalAmount ?? 0 | currency }}</div>
                    </div>
                    <button class="btn btn-outline btn-sm" (click)="updateMargin(row.id)">Update Margin</button>
                  </div>
                }
              </div>
            }
          </app-card-content>
        </app-card>

        <!-- Admin Actions -->
        <app-card>
          <app-card-header>
            <app-card-title>Pending Admin Actions</app-card-title>
            <app-card-description>Approve, reject, or confirm itineraries in your queue</app-card-description>
          </app-card-header>
          <app-card-content>
            @if (pendingAdmin.length === 0 && awaitingConfirm.length === 0) {
              <div class="text-center text-gray-500 py-6">No admin actions pending.</div>
            } @else {
              <div class="space-y-3">
                @for (row of pendingAdmin; track row.id) {
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <div class="font-semibold truncate">{{ row.tripName }}</div>
                        <app-badge class="bg-yellow-100 text-yellow-800">SENT_TO_ADMIN</app-badge>
                      </div>
                      <div class="text-sm text-gray-600 truncate">
                        Guest: {{ row.guestName }} · {{ row.destination }} · {{ row.daysCount }} days
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button class="btn btn-primary btn-sm" (click)="approveFinal(row.id)" [disabled]="busyIds.has(row.id)">
                        @if (busyIds.has(row.id)) { Working... } @else { Approve Final }
                      </button>
                      <button class="btn btn-outline btn-sm" (click)="reject(row.id)" [disabled]="busyIds.has(row.id)">
                        Reject
                      </button>
                      <button class="btn btn-outline btn-sm" (click)="navigateTo('/admin/itineraries')">
                        View
                      </button>
                    </div>
                  </div>
                }

                @for (row of awaitingConfirm; track row.id) {
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <div class="font-semibold truncate">{{ row.tripName }}</div>
                        <app-badge class="bg-blue-100 text-blue-800">Approved</app-badge>
                      </div>
                      <div class="text-sm text-gray-600 truncate">
                        Guest: {{ row.guestName }} · {{ row.destination }} · {{ row.daysCount }} days
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button class="btn btn-primary btn-sm" (click)="confirm(row.id)" [disabled]="busyIds.has(row.id)">
                        @if (busyIds.has(row.id)) { Working... } @else { Confirm }
                      </button>
                      <button class="btn btn-outline btn-sm" (click)="reject(row.id)" [disabled]="busyIds.has(row.id)">
                        Reject
                      </button>
                      <button class="btn btn-outline btn-sm" (click)="navigateTo('/admin/itineraries')">
                        View
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </app-card-content>
        </app-card>
      </div>
    </app-layout>
  `
})
export class AdminDashboardComponent implements OnInit {
  private router = inject(Router);

  private toastService = inject(ToastService);
  private itineraryService = inject(ItineraryService);
  private staffService = inject(StaffService);

  itineraries: CompanyItineraryRow[] = [];
  ownerSubmitted: CompanyItineraryRow[] = [];
  isLoading = false;
  errorMessage = '';
  busyIds = new Set<number>();

  driverCount = 0;
  guideCount = 0;

  get staffCount(): number {
    return this.driverCount + this.guideCount;
  }

  get pendingAdmin(): CompanyItineraryRow[] {
    return this.itineraries.filter(i => String(i.rawStatus ?? '').toLowerCase() === 'sent_to_admin');
  }

  get awaitingConfirm(): CompanyItineraryRow[] {
    return this.itineraries.filter(i => String(i.rawStatus ?? '').toLowerCase() === 'approved_by_admin');
  }

  get approvedItineraries(): CompanyItineraryRow[] {
    return this.itineraries.filter(i => String(i.rawStatus ?? '').toLowerCase() === 'approved_by_admin');
  }

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const [itins, ownerRows, drivers, guides] = await Promise.all([
        this.itineraryService.getCompanyItineraries(),
        this.itineraryService.getOwnerSubmittedItineraries().catch(() => [] as CompanyItineraryRow[]),
        this.staffService.getDrivers(),
        this.staffService.getGuides()
      ]);
      this.itineraries = itins ?? [];
      this.ownerSubmitted = ownerRows ?? [];
      this.driverCount = (drivers ?? []).length;
      this.guideCount = (guides ?? []).length;
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load admin dashboard data.';
    } finally {
      this.isLoading = false;
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async approveFinal(itineraryId: number): Promise<void> {
    if (this.busyIds.has(itineraryId)) return;
    this.busyIds.add(itineraryId);
    try {
      await this.itineraryService.adminApprove(itineraryId);
      this.toastService.success('Approved by admin.');
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to approve.');
    } finally {
      this.busyIds.delete(itineraryId);
    }
  }

  async confirm(itineraryId: number): Promise<void> {
    if (this.busyIds.has(itineraryId)) return;
    this.busyIds.add(itineraryId);
    try {
      await this.itineraryService.confirmItinerary(itineraryId);
      this.toastService.success('Itinerary confirmed.');
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to confirm.');
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
      console.error(e);
      this.toastService.error('Failed to reject.');
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
      console.error(e);
      this.toastService.error('Failed to update margin.');
    }
  }
}
