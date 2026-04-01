import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { BadgeComponent } from '../../components/ui/badge.component';
import { SeparatorComponent } from '../../components/ui/separator.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    BadgeComponent,
    SeparatorComponent,
    IconComponent
  ],
  template: `./booking-confirmation.component.html`,
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent {
  @Input() id = '';
  
  private router = inject(Router);
  private toastService = inject(ToastService);

  itineraryDays = [
    { day: 1, destination: 'Male, Maldives', activities: 'Arrival, Resort Check-in, Beach Welcome Dinner', accommodation: 'Water Villa' },
    { day: 2, destination: 'Male, Maldives', activities: 'Snorkeling Tour, Sunset Cruise', accommodation: 'Water Villa' },
    { day: 3, destination: 'Male, Maldives', activities: 'Spa Day, Private Beach Time', accommodation: 'Water Villa' },
    { day: 4, destination: 'Male, Maldives', activities: 'Scuba Diving, Island Hopping', accommodation: 'Water Villa' },
    { day: 5, destination: 'Male, Maldives', activities: 'Dolphin Watching, Beach Activities', accommodation: 'Water Villa' },
    { day: 6, destination: 'Male, Maldives', activities: 'Underwater Restaurant Lunch, Relaxation', accommodation: 'Water Villa' },
    { day: 7, destination: 'Male, Maldives', activities: 'Departure', accommodation: '-' },
  ];

  handleConfirmBooking(): void {
    this.toastService.success('Booking confirmed! You will receive confirmation email shortly.');
    setTimeout(() => this.router.navigate(['/guest/dashboard']), 2000);
  }

  handleRequestChanges(): void {
    this.toastService.info('Change request sent to travel expert');
  }
}
