import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { IconComponent } from '../ui/icons.component';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, IconComponent, NotificationBellComponent],
  templateUrl: './layout.component.html',
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent {
  @Input() title = '';
  @Input() role: UserRole = 'TRAVELER';

  private router = inject(Router);
  private authService = inject(AuthService);

  get navItems(): NavItem[] {
    if (this.role === 'TRAVELER') {
      return [
        { icon: 'home', label: 'Dashboard', path: '/guest/dashboard' },
        { icon: 'calendar', label: 'Create Itinerary', path: '/guest/itinerary-builder' },
      ];
    } else if (this.role === 'STAFF') {
      return [
        { icon: 'file-text', label: 'Review Queue', path: '/agency/review' },
        { icon: 'users', label: 'Resources', path: '/agency/staff' },
      ];
    } else {
      return [
        { icon: 'home', label: 'Dashboard', path: '/admin/dashboard' },
        { icon: 'file-text', label: 'All Itineraries', path: '/admin/itineraries' },
        { icon: 'users', label: 'Staff Users', path: '/admin/staff' },
        { icon: 'car', label: 'Drivers', path: '/admin/drivers' },
        { icon: 'user', label: 'Guides', path: '/admin/guides' },
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
