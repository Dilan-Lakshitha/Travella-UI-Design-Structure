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

interface Driver {
  id: number;
  name: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  phone: string;
  experience: string;
}

interface Guide {
  id: number;
  name: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  languages: string;
  phone: string;
  experience: string;
}

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
  template: `./staff-management.component.html`,
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent {
  activeTab = 'drivers';
  isCalendarDialogOpen = false;
  selectedStaffName = '';
  selectedDate: Date | null = new Date();

  mockDrivers: Driver[] = [
    { id: 1, name: 'Michael Chen', status: 'Available', phone: '+1 234-567-8900', experience: '5 years' },
    { id: 2, name: 'Sarah Williams', status: 'On Trip', phone: '+1 234-567-8901', experience: '3 years' },
    { id: 3, name: 'James Brown', status: 'Available', phone: '+1 234-567-8902', experience: '7 years' },
    { id: 4, name: 'Linda Davis', status: 'Off Duty', phone: '+1 234-567-8903', experience: '4 years' },
  ];

  mockGuides: Guide[] = [
    { id: 1, name: 'Emma Thompson', status: 'Available', languages: 'English, French', phone: '+1 234-567-9000', experience: '6 years' },
    { id: 2, name: 'Carlos Rodriguez', status: 'On Trip', languages: 'English, Spanish', phone: '+1 234-567-9001', experience: '4 years' },
    { id: 3, name: 'Yuki Tanaka', status: 'Available', languages: 'English, Japanese', phone: '+1 234-567-9002', experience: '5 years' },
    { id: 4, name: 'Ahmed Hassan', status: 'Off Duty', languages: 'English, Arabic', phone: '+1 234-567-9003', experience: '8 years' },
  ];

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
