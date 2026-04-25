import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { IconComponent } from '../../components/ui/icons.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    InputComponent,
    LabelComponent,
    IconComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  isSubmitting = false;

  get email(): string {
    return this.authService.getUser()?.email ?? '';
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    try {
      await this.authService.resetPassword(this.newPassword);
      this.toastService.success('Password updated. Please log in again.');
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error(e);
      this.toastService.error('Failed to reset password.');
    } finally {
      this.isSubmitting = false;
    }
  }
}

