import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { TextareaComponent, LabelComponent } from '../../components/ui/input.component';
import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogDescriptionComponent, DialogFooterComponent } from '../../components/ui/dialog.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

interface PendingReview {
  id: number;
  guestName: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  submittedDate: string;
  status: string;
}

interface DayDetail {
  day: number;
  destination: string;
  attractions: string[];
  mealPlan: string;
  accommodation: string;
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
    IconComponent
  ],
  template:'./agency-review.component.html'
})
export class AgencyReviewComponent {
  private router = inject(Router);
  private toastService = inject(ToastService);

  isDialogOpen = false;
  selectedItinerary: PendingReview | null = null;
  reviewNotes = '';
  correctionNotes = '';

  mockPendingReviews: PendingReview[] = [
    {
      id: 1,
      guestName: 'John Doe',
      tripName: 'European Adventure',
      destination: 'Paris - Rome - Barcelona',
      startDate: '2026-03-15',
      endDate: '2026-03-25',
      daysCount: 10,
      submittedDate: '2026-01-05',
      status: 'pending'
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      tripName: 'Asian Discovery',
      destination: 'Tokyo - Kyoto - Osaka',
      startDate: '2026-04-10',
      endDate: '2026-04-20',
      daysCount: 10,
      submittedDate: '2026-01-06',
      status: 'pending'
    },
    {
      id: 3,
      guestName: 'Mike Johnson',
      tripName: 'Safari Adventure',
      destination: 'Kenya - Tanzania',
      startDate: '2026-05-01',
      endDate: '2026-05-10',
      daysCount: 9,
      submittedDate: '2026-01-04',
      status: 'pending'
    },
  ];

  mockItineraryDetails: DayDetail[] = [
    {
      day: 1,
      destination: 'Paris, France',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
      mealPlan: 'BB',
      accommodation: 'Hotel'
    },
    {
      day: 2,
      destination: 'Paris, France',
      attractions: ['Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Elysees'],
      mealPlan: 'HB',
      accommodation: 'Hotel'
    },
    {
      day: 3,
      destination: 'Rome, Italy',
      attractions: ['Colosseum', 'Roman Forum', 'Trevi Fountain'],
      mealPlan: 'FB',
      accommodation: 'Hotel'
    },
  ];

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  openReviewDialog(review: PendingReview): void {
    this.selectedItinerary = review;
    this.isDialogOpen = true;
  }

  handleApprove(id: number): void {
    this.toastService.success('Itinerary approved successfully');
    this.isDialogOpen = false;
    this.router.navigate(['/agency/pricing', id]);
  }

  handleReturnForCorrection(): void {
    this.toastService.info('Itinerary returned to guest for corrections');
    this.isDialogOpen = false;
    this.selectedItinerary = null;
    this.correctionNotes = '';
  }

  handleReject(): void {
    this.toastService.error('Itinerary rejected');
    this.isDialogOpen = false;
    this.selectedItinerary = null;
  }
}
