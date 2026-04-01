import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent, TextareaComponent } from '../../components/ui/input.component';
import { SelectComponent, SelectOption } from '../../components/ui/select.component';
import { AccordionComponent, AccordionItemComponent, AccordionTriggerComponent, AccordionContentComponent } from '../../components/ui/accordion.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

interface DayPlan {
  id: number;
  dayNumber: number;
  destination: string;
  attractions: string[];
  mealPlan: string;
  accommodation: string;
  expanded: boolean;
}

@Component({
  selector: 'app-itinerary-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    InputComponent,
    LabelComponent,
    SelectComponent,
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
    IconComponent
  ],
  template: `./itinerary-builder.component.html`,
  styleUrls: ['./itinerary-builder.component.scss']
})
export class ItineraryBuilderComponent {
  private router = inject(Router);
  private toastService = inject(ToastService);

  tripName = '';
  startDate = '';
  endDate = '';

  days: DayPlan[] = [
    {
      id: 1,
      dayNumber: 1,
      destination: '',
      attractions: [''],
      mealPlan: 'BB',
      accommodation: '',
      expanded: true
    }
  ];

  mealPlanOptions: SelectOption[] = [
    { value: 'BB', label: 'Bed & Breakfast (BB)' },
    { value: 'HB', label: 'Half Board (HB)' },
    { value: 'FB', label: 'Full Board (FB)' },
    { value: 'AI', label: 'All Inclusive (AI)' }
  ];

  accommodationOptions: SelectOption[] = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' }
  ];

  toggleDay(day: DayPlan): void {
    day.expanded = !day.expanded;
  }

  addDay(): void {
    const newDay: DayPlan = {
      id: this.days.length + 1,
      dayNumber: this.days.length + 1,
      destination: '',
      attractions: [''],
      mealPlan: 'BB',
      accommodation: '',
      expanded: true
    };
    this.days.push(newDay);
  }

  removeDay(id: number): void {
    if (this.days.length > 1) {
      this.days = this.days.filter(d => d.id !== id);
      // Renumber days
      this.days.forEach((day, index) => {
        day.dayNumber = index + 1;
      });
    }
  }

  addAttraction(day: DayPlan): void {
    day.attractions.push('');
  }

  removeAttraction(day: DayPlan, index: number): void {
    day.attractions.splice(index, 1);
  }

  handleSaveDraft(): void {
    this.toastService.success('Itinerary saved as draft');
  }

  handleSubmit(): void {
    this.toastService.success('Itinerary submitted for review');
    setTimeout(() => this.router.navigate(['/guest/dashboard']), 1500);
  }
}
