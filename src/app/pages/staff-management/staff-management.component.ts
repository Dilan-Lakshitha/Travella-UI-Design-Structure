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
  template: `
    <app-layout title="Staff & Resource Management" role="agency">
      <div class="space-y-6">
        <app-tabs [value]="activeTab" (valueChange)="activeTab = $event">
          <app-tabs-list class="grid w-full max-w-md grid-cols-2">
            <app-tabs-trigger
              value="drivers"
              [active]="activeTab === 'drivers'"
              (tabSelect)="activeTab = $event"
            >
              Drivers
            </app-tabs-trigger>
            <app-tabs-trigger
              value="guides"
              [active]="activeTab === 'guides'"
              (tabSelect)="activeTab = $event"
            >
              Guides
            </app-tabs-trigger>
          </app-tabs-list>

          <!-- Drivers Tab -->
          <app-tabs-content value="drivers" [active]="activeTab === 'drivers'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Driver List</h3>
              <button class="btn btn-primary">
                <app-icon name="plus" [size]="16" class="mr-2" />
                Add Driver
              </button>
            </div>

            <app-card>
              <app-card-content class="p-0">
                <app-table>
                  <app-table-header>
                    <app-table-row>
                      <app-table-head>Name</app-table-head>
                      <app-table-head>Experience</app-table-head>
                      <app-table-head>Phone</app-table-head>
                      <app-table-head>Status</app-table-head>
                      <app-table-head>Actions</app-table-head>
                    </app-table-row>
                  </app-table-header>
                  <app-table-body>
                    @for (driver of mockDrivers; track driver.id) {
                      <app-table-row>
                        <app-table-cell class="font-medium">
                          <div class="flex items-center">
                            <div class="rounded-full bg-blue-100 p-2 mr-3">
                              <app-icon name="car" [size]="16" class="text-blue-600" />
                            </div>
                            {{ driver.name }}
                          </div>
                        </app-table-cell>
                        <app-table-cell>{{ driver.experience }}</app-table-cell>
                        <app-table-cell>{{ driver.phone }}</app-table-cell>
                        <app-table-cell>
                          <app-badge [class]="getStatusBadgeClass(driver.status)">
                            {{ driver.status }}
                          </app-badge>
                        </app-table-cell>
                        <app-table-cell>
                          <button
                            class="btn btn-outline btn-sm"
                            (click)="openCalendarDialog(driver.name)"
                          >
                            <app-icon name="calendar" [size]="16" class="mr-2" />
                            View Availability
                          </button>
                        </app-table-cell>
                      </app-table-row>
                    }
                  </app-table-body>
                </app-table>
              </app-card-content>
            </app-card>
          </app-tabs-content>

          <!-- Guides Tab -->
          <app-tabs-content value="guides" [active]="activeTab === 'guides'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Guide List</h3>
              <button class="btn btn-primary">
                <app-icon name="plus" [size]="16" class="mr-2" />
                Add Guide
              </button>
            </div>

            <app-card>
              <app-card-content class="p-0">
                <app-table>
                  <app-table-header>
                    <app-table-row>
                      <app-table-head>Name</app-table-head>
                      <app-table-head>Languages</app-table-head>
                      <app-table-head>Experience</app-table-head>
                      <app-table-head>Phone</app-table-head>
                      <app-table-head>Status</app-table-head>
                      <app-table-head>Actions</app-table-head>
                    </app-table-row>
                  </app-table-header>
                  <app-table-body>
                    @for (guide of mockGuides; track guide.id) {
                      <app-table-row>
                        <app-table-cell class="font-medium">
                          <div class="flex items-center">
                            <div class="rounded-full bg-purple-100 p-2 mr-3">
                              <app-icon name="user" [size]="16" class="text-purple-600" />
                            </div>
                            {{ guide.name }}
                          </div>
                        </app-table-cell>
                        <app-table-cell>{{ guide.languages }}</app-table-cell>
                        <app-table-cell>{{ guide.experience }}</app-table-cell>
                        <app-table-cell>{{ guide.phone }}</app-table-cell>
                        <app-table-cell>
                          <app-badge [class]="getStatusBadgeClass(guide.status)">
                            {{ guide.status }}
                          </app-badge>
                        </app-table-cell>
                        <app-table-cell>
                          <button
                            class="btn btn-outline btn-sm"
                            (click)="openCalendarDialog(guide.name)"
                          >
                            <app-icon name="calendar" [size]="16" class="mr-2" />
                            View Availability
                          </button>
                        </app-table-cell>
                      </app-table-row>
                    }
                  </app-table-body>
                </app-table>
              </app-card-content>
            </app-card>
          </app-tabs-content>
        </app-tabs>
      </div>

      <!-- Calendar Dialog -->
      <app-dialog
        [open]="isCalendarDialogOpen"
        (openChange)="isCalendarDialogOpen = $event"
        size="lg"
      >
        <app-dialog-header>
          <app-dialog-title>{{ selectedStaffName }} - Availability Calendar</app-dialog-title>
        </app-dialog-header>
        <div class="py-4">
          <app-calendar
            [selected]="selectedDate"
            (selectedChange)="selectedDate = $event"
            class="rounded-md border"
          />
          <div class="mt-4 space-y-2">
            <h4 class="font-semibold">Legend:</h4>
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center">
                <div class="w-4 h-4 bg-green-200 rounded mr-2"></div>
                <span class="text-sm">Available</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-red-200 rounded mr-2"></div>
                <span class="text-sm">Booked</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <span class="text-sm">Unavailable</span>
              </div>
            </div>
          </div>
        </div>
      </app-dialog>
    </app-layout>
  `
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
