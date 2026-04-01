import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { IconComponent } from '../../components/ui/icons.component';

interface Itinerary {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'confirmed' | 'corrected';
  daysCount: number;
}

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent,
    IconComponent
  ],
  template: `./guest-dashboard.component.html`,
  styleUrls: ['./guest-dashboard.component.scss']
})
export class GuestDashboardComponent {
  private router = inject(Router);

  mockItineraries: Itinerary[] = [
    {
      id: 1,
      title: 'European Adventure',
      destination: 'Paris, France → Rome, Italy',
      startDate: '2026-03-15',
      endDate: '2026-03-25',
      status: 'draft',
      daysCount: 10
    },
    {
      id: 2,
      title: 'Asian Discovery Tour',
      destination: 'Tokyo → Kyoto → Osaka',
      startDate: '2026-04-10',
      endDate: '2026-04-20',
      status: 'submitted',
      daysCount: 10
    },
    {
      id: 3,
      title: 'Beach Paradise',
      destination: 'Maldives',
      startDate: '2026-02-01',
      endDate: '2026-02-08',
      status: 'approved',
      daysCount: 7
    },
    {
      id: 4,
      title: 'Mountain Retreat',
      destination: 'Swiss Alps',
      startDate: '2026-01-20',
      endDate: '2026-01-27',
      status: 'confirmed',
      daysCount: 7
    },
  ];

  get draftItineraries(): Itinerary[] {
    return this.mockItineraries.filter(i => i.status === 'draft');
  }

  get submittedItineraries(): Itinerary[] {
    return this.mockItineraries.filter(i => i.status === 'submitted');
  }

  get approvedItineraries(): Itinerary[] {
    return this.mockItineraries.filter(i => ['approved', 'confirmed'].includes(i.status));
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      confirmed: 'bg-purple-100 text-purple-800',
      corrected: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  navigateToBuilder(): void {
    this.router.navigate(['/guest/itinerary-builder']);
  }

  navigateToBooking(id: number): void {
    this.router.navigate(['/guest/booking', id]);
  }
}
