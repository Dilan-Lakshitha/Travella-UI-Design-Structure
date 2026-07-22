import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../../components/ui/tabs.component';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../components/ui/table.component';
import { AdminBookingCalendarComponent } from '../../components/admin-booking-calendar/admin-booking-calendar.component';
import { StaffService } from '../../services/staff.service';
import { ToastService } from '../../services/toast.service';
import type { DriverDto, GuideDto } from '../../models/staff.models';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardContentComponent,
    BadgeComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    AdminBookingCalendarComponent,
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss'],
})
export class StaffManagementComponent implements OnInit {
  constructor(private staffService: StaffService, private toastService: ToastService) {}

  activeTab = 'drivers';

  drivers: DriverDto[] = [];
  guides: GuideDto[] = [];
  isLoading = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const [drivers, guides] = await Promise.all([
        this.staffService.getDrivers(),
        this.staffService.getGuides(),
      ]);
      this.drivers = drivers ?? [];
      this.guides = guides ?? [];
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load staff resources.';
      this.toastService.error(this.errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  availabilityBadgeClass(status?: string | null): string {
    const value = (status ?? 'AVAILABLE').toUpperCase();
    if (value === 'ON_TRIP' || value === 'OFF_DUTY' || value === 'UNAVAILABLE') {
      return 'bg-gray-100 text-gray-800';
    }
    if (value === 'BOOKED') {
      return 'bg-rose-100 text-rose-800';
    }
    return 'bg-emerald-100 text-emerald-800';
  }
}
