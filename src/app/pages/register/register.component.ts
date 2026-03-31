import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  errorMessage = '';

  async register(): Promise<void> {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password and confirm password must match.';
      return;
    }

    const isSuccess = await this.authService.registerTraveler(
      this.name,
      this.email,
      this.password,
      this.phone || undefined
    );

    if (!isSuccess) {
      this.errorMessage = 'Registration failed. Email may already be in use.';
      return;
    }

    this.router.navigate(['/guest/dashboard']);
  }
}
