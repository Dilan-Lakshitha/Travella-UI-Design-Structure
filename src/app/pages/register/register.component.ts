import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  Lock,
  Phone,
  ArrowRight
} from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly Plane = Plane;
  readonly Briefcase = Briefcase;
  readonly Hotel = Hotel;
  readonly Bell = Bell;
  readonly Map = Map;
  readonly Building2 = Building2;
  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Phone = Phone;
  readonly ArrowRight = ArrowRight;

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  companySlug = '';

  ngOnInit() {
    this.companySlug =
      this.route.snapshot.paramMap.get('slug')!;
  }

  async register(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password and confirm password must match.';
      this.isLoading = false;
      return;
    }

    const isSuccess = await this.authService.registerTraveler(
      this.name,
      this.email,
      this.password,
      this.phone || undefined,
      this.companySlug
    );

    if (!isSuccess) {
      this.errorMessage = 'Registration failed. Email may already be in use.';
      this.isLoading = false;
      return;
    }

    this.successMessage = 'Registration successful. You can now log in.';
    this.isLoading = false;
  }

  goToCompanyApplication(): void {
    this.router.navigate(["/company-application"]);
  }
}
