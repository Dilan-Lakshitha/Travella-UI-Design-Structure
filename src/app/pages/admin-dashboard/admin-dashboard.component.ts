import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { IconComponent } from '../../components/ui/icons.component';

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
    IconComponent
  ],
  template: `
    <app-layout title="System Overview" role="admin">
      <div class="space-y-6">
        <!-- Key Metrics -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Total Itineraries</app-card-title>
              <app-icon name="file-text" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">85</div>
              <p class="text-xs text-muted-foreground">+12% from last month</p>
            </app-card-content>
          </app-card>

          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Active Bookings</app-card-title>
              <app-icon name="calendar" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">30</div>
              <p class="text-xs text-muted-foreground">Currently in progress</p>
            </app-card-content>
          </app-card>

          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Total Revenue</app-card-title>
              <app-icon name="dollar-sign" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">$381,000</div>
              <p class="text-xs text-muted-foreground">+24% from last month</p>
            </app-card-content>
          </app-card>

          <app-card>
            <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
              <app-card-title class="text-sm font-medium">Staff Members</app-card-title>
              <app-icon name="users" [size]="16" class="text-muted-foreground" />
            </app-card-header>
            <app-card-content>
              <div class="text-2xl font-bold">24</div>
              <p class="text-xs text-muted-foreground">8 drivers, 16 guides</p>
            </app-card-content>
          </app-card>
        </div>

        <!-- Charts Row -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Monthly Bookings Chart -->
          <app-card>
            <app-card-header>
              <app-card-title>Monthly Bookings</app-card-title>
              <app-card-description>Number of bookings per month</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="h-[300px] flex items-end justify-between gap-2 pt-4">
                @for (data of monthlyBookingsData; track data.month) {
                  <div class="flex flex-col items-center gap-2 flex-1">
                    <div
                      class="w-full bg-blue-500 rounded-t transition-all"
                      [style.height.px]="data.bookings * 3"
                    ></div>
                    <span class="text-xs text-muted-foreground">{{ data.month }}</span>
                  </div>
                }
              </div>
            </app-card-content>
          </app-card>

          <!-- Status Distribution -->
          <app-card>
            <app-card-header>
              <app-card-title>Itinerary Status Distribution</app-card-title>
              <app-card-description>Current status breakdown</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="flex items-center justify-center h-[300px]">
                <div class="grid grid-cols-2 gap-4">
                  @for (data of statusData; track data.name) {
                    <div class="flex items-center gap-2">
                      <div
                        class="w-4 h-4 rounded-full"
                        [style.backgroundColor]="data.color"
                      ></div>
                      <span class="text-sm">{{ data.name }}: {{ data.value }}</span>
                    </div>
                  }
                </div>
              </div>
            </app-card-content>
          </app-card>
        </div>

        <!-- Revenue Chart -->
        <app-card>
          <app-card-header>
            <app-card-title>Revenue Trend</app-card-title>
            <app-card-description>Monthly revenue over time</app-card-description>
          </app-card-header>
          <app-card-content>
            <div class="h-[300px] flex items-end justify-between gap-4 pt-4">
              @for (data of revenueData; track data.month) {
                <div class="flex flex-col items-center gap-2 flex-1">
                  <div
                    class="w-full bg-green-500 rounded-t transition-all"
                    [style.height.px]="data.revenue / 400"
                  ></div>
                  <span class="text-xs text-muted-foreground">{{ data.month }}</span>
                  <span class="text-xs font-medium">{{'$' + (data.revenue / 1000) + 'k'}}</span>
                </div>
              }
            </div>
          </app-card-content>
        </app-card>

        <!-- Recent Activities & Quick Actions -->
        <div class="grid gap-4 md:grid-cols-3">
          <!-- Recent Activities -->
          <app-card class="md:col-span-2">
            <app-card-header>
              <app-card-title>Recent Activities</app-card-title>
              <app-card-description>Latest system activities and updates</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="space-y-4">
                @for (activity of recentActivities; track activity.id) {
                  <div class="flex items-start space-x-4">
                    <div [class]="'rounded-full p-2 ' + (activity.type === 'success' ? 'bg-green-100' : 'bg-blue-100')">
                      <app-icon
                        [name]="activity.type === 'success' ? 'circle-check' : 'clock'"
                        [size]="16"
                        [class]="activity.type === 'success' ? 'text-green-600' : 'text-blue-600'"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium">{{ activity.action }}</p>
                      <p class="text-xs text-gray-500">{{ activity.user }} - {{ activity.time }}</p>
                    </div>
                  </div>
                }
              </div>
            </app-card-content>
          </app-card>

          <!-- Quick Actions -->
          <app-card>
            <app-card-header>
              <app-card-title>Quick Actions</app-card-title>
              <app-card-description>Common tasks and shortcuts</app-card-description>
            </app-card-header>
            <app-card-content class="space-y-2">
              <button class="btn btn-outline w-full justify-start" (click)="navigateTo('/admin/itineraries')">
                <app-icon name="file-text" [size]="16" class="mr-2" />
                View All Itineraries
              </button>
              <button class="btn btn-outline w-full justify-start" (click)="navigateTo('/agency/review')">
                <app-icon name="clock" [size]="16" class="mr-2" />
                Pending Reviews
              </button>
              <button class="btn btn-outline w-full justify-start" (click)="navigateTo('/agency/staff')">
                <app-icon name="users" [size]="16" class="mr-2" />
                Manage Staff
              </button>
              <button class="btn btn-outline w-full justify-start">
                <app-icon name="trending-up" [size]="16" class="mr-2" />
                Financial Reports
              </button>
              <button class="btn btn-outline w-full justify-start">
                <app-icon name="settings" [size]="16" class="mr-2" />
                System Settings
              </button>
            </app-card-content>
          </app-card>
        </div>
      </div>
    </app-layout>
  `
})
export class AdminDashboardComponent {
  private router = inject(Router);

  monthlyBookingsData = [
    { month: 'Jan', bookings: 45 },
    { month: 'Feb', bookings: 52 },
    { month: 'Mar', bookings: 61 },
    { month: 'Apr', bookings: 58 },
    { month: 'May', bookings: 70 },
    { month: 'Jun', bookings: 85 },
  ];

  statusData = [
    { name: 'Draft', value: 12, color: '#94a3b8' },
    { name: 'Submitted', value: 18, color: '#3b82f6' },
    { name: 'Approved', value: 25, color: '#22c55e' },
    { name: 'Confirmed', value: 30, color: '#a855f7' },
  ];

  revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 61000 },
    { month: 'Apr', revenue: 58000 },
    { month: 'May', revenue: 70000 },
    { month: 'Jun', revenue: 95000 },
  ];

  recentActivities = [
    { id: 1, action: 'New booking confirmed', user: 'John Doe', time: '5 minutes ago', type: 'success' },
    { id: 2, action: 'Itinerary submitted for review', user: 'Jane Smith', time: '15 minutes ago', type: 'info' },
    { id: 3, action: 'Payment received', user: 'Mike Johnson', time: '1 hour ago', type: 'success' },
    { id: 4, action: 'Guide assigned to tour', user: 'Emma Thompson', time: '2 hours ago', type: 'info' },
    { id: 5, action: 'New user registered', user: 'Sarah Williams', time: '3 hours ago', type: 'info' },
  ];

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
