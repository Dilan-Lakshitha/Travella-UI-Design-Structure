import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../../components/ui/tabs.component';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../components/ui/table.component';
import { DialogComponent, DialogHeaderComponent, DialogTitleComponent } from '../../components/ui/dialog.component';
import { CalendarComponent } from '../../components/ui/calendar.component';
import { IconComponent } from '../../components/ui/icons.component';
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
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    CalendarComponent,
    IconComponent
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent {
  constructor(private staffService: StaffService, private toastService: ToastService) {}

  activeTab = 'drivers';
  isCalendarDialogOpen = false;
  selectedStaffName = '';
  selectedDate: Date | null = new Date();

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
        this.staffService.getGuides()
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'On Trip':
        return 'bg-blue-100 text-blue-800';
      case 'Off Duty':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  }

  openCalendarDialog(name: string): void {
    this.selectedStaffName = name;
    this.isCalendarDialogOpen = true;
  }
}
