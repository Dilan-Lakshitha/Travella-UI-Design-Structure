import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../components/ui/table.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { SelectComponent, SelectOption } from '../../components/ui/select.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';
import { AdminService } from '../../services/admin.service';
import type { DriverDto } from '../../models/staff.models';

@Component({
  selector: 'app-admin-drivers',
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
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    InputComponent,
    LabelComponent,
    SelectComponent,
    IconComponent
  ],
  templateUrl: './admin-drivers.component.html',
  styleUrls: ['./admin-drivers.component.scss']
})
export class AdminDriversComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  rows: DriverDto[] = [];
  isLoading = false;
  errorMessage = '';
  isCreating = false;

  name = '';
  phone = '';
  experience: number = 0;
  availability = 'AVAILABLE';

  availabilityOptions: SelectOption[] = [
    { value: 'AVAILABLE', label: 'AVAILABLE' },
    { value: 'ON_TRIP', label: 'ON_TRIP' },
    { value: 'OFF_DUTY', label: 'OFF_DUTY' }
  ];

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.rows = await this.adminService.getDrivers();
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load drivers.';
    } finally {
      this.isLoading = false;
    }
  }

  async create(): Promise<void> {
    if (!this.name.trim() || !this.phone.trim()) {
      this.toastService.error('Name and phone are required.');
      return;
    }
    this.isCreating = true;
    try {
      await this.adminService.createDriver({
        name: this.name.trim(),
        phone: this.phone.trim(),
        experience: this.experience,
        availability: this.availability
      });
      this.toastService.success('Driver created.');
      this.name = '';
      this.phone = '';
      this.experience = 0;
      this.availability = 'AVAILABLE';
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to create driver.');
    } finally {
      this.isCreating = false;
    }
  }
}

