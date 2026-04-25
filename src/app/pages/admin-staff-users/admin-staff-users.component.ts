import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card.component';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../components/ui/table.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { IconComponent } from '../../components/ui/icons.component';
import { ToastService } from '../../services/toast.service';
import { AdminService, StaffUserRow } from '../../services/admin.service';

@Component({
  selector: 'app-admin-staff-users',
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
    IconComponent
  ],
  templateUrl: './admin-staff-users.component.html',
  styleUrls: ['./admin-staff-users.component.scss']
})
export class AdminStaffUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  isLoading = false;
  errorMessage = '';
  rows: StaffUserRow[] = [];

  name = '';
  email = '';
  isCreating = false;

  lastCreated: { email: string; temporaryPassword: string } | null = null;

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.rows = await this.adminService.getStaffUsers();
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Failed to load staff users.';
    } finally {
      this.isLoading = false;
    }
  }

  async create(): Promise<void> {
    if (!this.name.trim() || !this.email.trim()) {
      this.toastService.error('Name and email are required.');
      return;
    }

    this.isCreating = true;
    try {
      const res = await this.adminService.createStaff(this.name.trim(), this.email.trim());
      this.lastCreated = res;
      this.toastService.success('Staff user created.');
      this.name = '';
      this.email = '';
      await this.refresh();
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to create staff user.');
    } finally {
      this.isCreating = false;
    }
  }
}

