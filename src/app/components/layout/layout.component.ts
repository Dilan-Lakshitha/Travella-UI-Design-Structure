import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { IconComponent } from '../ui/icons.component';
import { ButtonComponent } from '../ui/button.component';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-3">
              <div class="rounded-full bg-blue-500 p-2">
                <app-icon name="plane" [size]="20" class="text-white" />
              </div>
              <div>
                <h1 class="text-xl font-semibold">Travella</h1>
                <p class="text-xs text-gray-500 capitalize">{{ role }} Portal</p>
              </div>
            </div>
            
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              (click)="logout()"
            >
              <app-icon name="log-out" [size]="16" class="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Navigation Tabs -->
        <div class="mb-6">
          <div class="flex space-x-1 border-b">
            @for (item of navItems; track item.path) {
              <button
                type="button"
                [class]="getNavItemClasses(item.path)"
                (click)="navigateTo(item.path)"
              >
                <app-icon [name]="item.icon" [size]="16" class="mr-2" />
                <span>{{ item.label }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Page Title -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        </div>

        <!-- Main Content -->
        <div>
          <ng-content />
        </div>
      </div>
    </div>
  `
})
export class LayoutComponent {
  @Input() title = '';
  @Input() role: UserRole = 'guest';

  private router = inject(Router);
  private authService = inject(AuthService);

  get navItems(): NavItem[] {
    if (this.role === 'guest') {
      return [
        { icon: 'home', label: 'Dashboard', path: '/guest/dashboard' },
        { icon: 'calendar', label: 'Create Itinerary', path: '/guest/itinerary-builder' },
      ];
    } else if (this.role === 'agency') {
      return [
        { icon: 'file-text', label: 'Review Queue', path: '/agency/review' },
        { icon: 'users', label: 'Staff Management', path: '/agency/staff' },
      ];
    } else {
      return [
        { icon: 'home', label: 'Dashboard', path: '/admin/dashboard' },
        { icon: 'file-text', label: 'All Itineraries', path: '/admin/itineraries' },
        { icon: 'users', label: 'Staff', path: '/agency/staff' },
      ];
    }
  }

  getNavItemClasses(path: string): string {
    const isActive = this.router.url === path;
    const baseClasses = 'flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors';
    
    if (isActive) {
      return `${baseClasses} border-blue-500 text-blue-600`;
    }
    return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
