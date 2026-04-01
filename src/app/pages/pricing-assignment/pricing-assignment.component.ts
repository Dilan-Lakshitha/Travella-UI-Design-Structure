import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { SelectComponent, SelectOption } from '../../components/ui/select.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pricing-assignment',
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
    IconComponent
  ],
  template: `./pricing-assignment.component.html`,
  styleUrls: ['./pricing-assignment.component.scss']
})
export class PricingAssignmentComponent {
  @Input() id = '';
  
  private router = inject(Router);
  private toastService = inject(ToastService);

  vehicleCost = 1200;
  driverFee = 500;
  guideFee = 800;
  accommodationCost = 2400;
  adultTickets = 300;
  childTickets = 150;
  selectedDriver = '';
  selectedGuide = '';

  driverOptions: SelectOption[] = [
    { value: '1', label: 'Michael Chen' },
    { value: '2', label: 'Sarah Williams' },
    { value: '3', label: 'James Brown', disabled: true },
  ];

  guideOptions: SelectOption[] = [
    { value: '1', label: 'Emma Thompson - English, French' },
    { value: '2', label: 'Carlos Rodriguez - English, Spanish' },
    { value: '3', label: 'Yuki Tanaka - English, Japanese', disabled: true },
  ];

  calculateTotal(): number {
    return (
      (this.vehicleCost || 0) +
      (this.driverFee || 0) +
      (this.guideFee || 0) +
      (this.accommodationCost || 0) +
      (this.adultTickets || 0) +
      (this.childTickets || 0)
    );
  }

  getDriverName(id: string): string {
    const driver = this.driverOptions.find(d => d.value === id);
    return driver?.label || '';
  }

  getGuideName(id: string): string {
    const guide = this.guideOptions.find(g => g.value === id);
    return guide?.label || '';
  }

  handleGeneratePackage(): void {
    if (!this.selectedDriver || !this.selectedGuide) {
      this.toastService.error('Please assign both driver and guide');
      return;
    }
    this.toastService.success('Package generated successfully');
    setTimeout(() => this.router.navigate(['/agency/review']), 1500);
  }
}
