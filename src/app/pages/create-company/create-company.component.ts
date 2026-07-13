import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '@app/services/company.service';
import {
  LucideAngularModule,
  Building2,
  Mail,
  Phone,
  User,
  Plus,
  ShieldCheck,
  ArrowLeft
} from 'lucide-angular';

@Component({
  selector: 'app-create-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent {

  readonly Building2 = Building2;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly User = User;
  readonly Plus = Plus;
  readonly ShieldCheck = ShieldCheck;
  readonly ArrowLeft = ArrowLeft;

  companyName = '';
  companyEmail = '';
  phone = '';
  status = 'ACTIVE';

  ownerName = '';
  adminEmail = '';

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  private readonly companyService = inject(CompanyService);

  async createCompany(): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.companyName.trim() ||
      !this.companyEmail.trim() ||
      !this.phone.trim() ||
      !this.ownerName.trim() ||
      !this.adminEmail.trim()
    ) {
      this.errorMessage =
        'Please fill all required fields.';
      return;
    }

    try {
      this.isSubmitting = true;

      const result = await this.companyService.createCompany({
          name: this.companyName.trim(),
          email: this.companyEmail.trim(),
          phone: this.phone.trim(),
          ownerName: this.ownerName.trim(),
          adminEmail: this.adminEmail.trim()
        });

      this.successMessage =
        result.welcomeEmailSent
          ? `Company created successfully. Login details were emailed to ${result.adminEmail}.`
          : `Company created successfully, but the welcome email could not be sent.`;

      console.log('Company URL:', result.companyUrl);

      this.resetForm();

    } catch (error: any) {

      this.errorMessage =
        error?.error?.message ??
        'Unable to create company.';

    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm(): void {
    this.companyName = '';
    this.companyEmail = '';
    this.phone = '';
    this.status = 'ACTIVE';
    this.ownerName = '';
    this.adminEmail = '';
  }
}