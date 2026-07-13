import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Plane,
  Briefcase,
  Hotel,
  Bell,
  Map,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  ArrowRight
} from 'lucide-angular';

import { AuthService } from '../../services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-company-application',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './company-application.component.html',
  styleUrls: ['./company-application.component.scss']
})
export class CompanyApplicationComponent {

  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly Plane = Plane;
  readonly Briefcase = Briefcase;
  readonly Hotel = Hotel;
  readonly Bell = Bell;
  readonly Map = Map;
  readonly Building2 = Building2;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly FileText = FileText;
  readonly ArrowRight = ArrowRight;

  companyName = '';
  ownerName = '';
  email = '';
  phone = '';
  companyDescription = '';

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  companySlug = '';

  ngOnInit() {
    this.companySlug =
      this.route.snapshot.paramMap.get('slug')!;
  }

  async submitApplication(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.companyName.trim() ||
      !this.ownerName.trim() ||
      !this.email.trim() ||
      !this.phone.trim()
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    try {
      this.isSubmitting = true;

      const response =
        await this.authService.submitCompanyApplication(
          this.companyName.trim(),
          this.ownerName.trim(),
          this.email.trim(),
          this.phone.trim(),
          this.companyDescription.trim()
        );

      this.successMessage =
        response.message ||
        'Company application submitted successfully.';

      this.resetForm();

    } catch (error: any) {
      console.error('Company application submission failed:', error);

      this.errorMessage =
        error?.error?.message ||
        error?.error?.error ||
        'Something went wrong while submitting the application.';

    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm(): void {
    this.companyName = '';
    this.ownerName = '';
    this.email = '';
    this.phone = '';
    this.companyDescription = '';
  }
}