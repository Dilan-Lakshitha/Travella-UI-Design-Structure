import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../../components/ui/card.component';
import { InputComponent, LabelComponent } from '../../components/ui/input.component';
import { ButtonComponent } from '../../components/ui/button.component';
import { TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../../components/ui/tabs.component';
import { IconComponent } from '../../components/ui/icons.component';

@Component({
  selector: 'app-login',
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
    ButtonComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    IconComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <app-card class="w-full max-w-md">
        <app-card-header class="space-y-1 text-center">
          <div class="flex justify-center mb-4">
            <div class="rounded-full bg-blue-500 p-3">
              <app-icon name="plane" [size]="32" class="text-white" />
            </div>
          </div>
          <app-card-title class="text-3xl">Travella</app-card-title>
          <app-card-description>Travel Management System</app-card-description>
        </app-card-header>
        
        <app-card-content>
          <app-tabs [value]="selectedRole" (valueChange)="onRoleChange($event)">
            <app-tabs-list class="grid w-full grid-cols-3">
              <app-tabs-trigger
                value="guest"
                [active]="selectedRole === 'guest'"
                (tabSelect)="onRoleChange($event)"
              >
                Guest
              </app-tabs-trigger>
              <app-tabs-trigger
                value="agency"
                [active]="selectedRole === 'agency'"
                (tabSelect)="onRoleChange($event)"
              >
                Agency
              </app-tabs-trigger>
              <app-tabs-trigger
                value="admin"
                [active]="selectedRole === 'admin'"
                (tabSelect)="onRoleChange($event)"
              >
                Admin
              </app-tabs-trigger>
            </app-tabs-list>
            
            <!-- Guest Tab -->
            <app-tabs-content value="guest" [active]="selectedRole === 'guest'" class="space-y-4 mt-4">
              <form (ngSubmit)="handleLogin()" class="space-y-4">
                <div class="space-y-2">
                  <app-label for="guest-email">Email</app-label>
                  <app-input
                    id="guest-email"
                    type="email"
                    placeholder="guest@example.com"
                    [(ngModel)]="email"
                    name="email"
                    [required]="true"
                  />
                </div>
                <div class="space-y-2">
                  <app-label for="guest-password">Password</app-label>
                  <app-input
                    id="guest-password"
                    type="password"
                    placeholder="••••••••"
                    [(ngModel)]="password"
                    name="password"
                    [required]="true"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-full">
                  Sign In as Guest
                </button>
              </form>
            </app-tabs-content>
            
            <!-- Agency Tab -->
            <app-tabs-content value="agency" [active]="selectedRole === 'agency'" class="space-y-4 mt-4">
              <form (ngSubmit)="handleLogin()" class="space-y-4">
                <div class="space-y-2">
                  <app-label for="agency-email">Email</app-label>
                  <app-input
                    id="agency-email"
                    type="email"
                    placeholder="expert@agency.com"
                    [(ngModel)]="email"
                    name="email"
                    [required]="true"
                  />
                </div>
                <div class="space-y-2">
                  <app-label for="agency-password">Password</app-label>
                  <app-input
                    id="agency-password"
                    type="password"
                    placeholder="••••••••"
                    [(ngModel)]="password"
                    name="password"
                    [required]="true"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-full">
                  Sign In as Expert
                </button>
              </form>
            </app-tabs-content>
            
            <!-- Admin Tab -->
            <app-tabs-content value="admin" [active]="selectedRole === 'admin'" class="space-y-4 mt-4">
              <form (ngSubmit)="handleLogin()" class="space-y-4">
                <div class="space-y-2">
                  <app-label for="admin-email">Email</app-label>
                  <app-input
                    id="admin-email"
                    type="email"
                    placeholder="admin@travella.com"
                    [(ngModel)]="email"
                    name="email"
                    [required]="true"
                  />
                </div>
                <div class="space-y-2">
                  <app-label for="admin-password">Password</app-label>
                  <app-input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    [(ngModel)]="password"
                    name="password"
                    [required]="true"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-full">
                  Sign In as Admin
                </button>
              </form>
            </app-tabs-content>
          </app-tabs>
        </app-card-content>
        
        <app-card-footer class="flex flex-col space-y-2">
          <div class="text-sm text-muted-foreground text-center">
            Demo credentials: Use any email/password
          </div>
        </app-card-footer>
      </app-card>
    </div>
  `
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  selectedRole: UserRole = 'guest';
  email = '';
  password = '';

  onRoleChange(role: string): void {
    this.selectedRole = role as UserRole;
  }

  handleLogin(): void {
    this.authService.login(this.email, this.selectedRole);
    const redirectUrl = this.authService.getRedirectUrl(this.selectedRole);
    this.router.navigate([redirectUrl]);
  }
}
