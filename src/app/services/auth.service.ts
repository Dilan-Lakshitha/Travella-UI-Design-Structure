import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'guest' | 'agency' | 'admin';

export interface User {
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal(false);

  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  userRole = computed(() => this.userSignal()?.role ?? 'guest');

  login(email: string, role: UserRole): void {
    this.userSignal.set({ email, role });
    this.isAuthenticatedSignal.set(true);
  }

  logout(): void {
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  getRedirectUrl(role: UserRole): string {
    switch (role) {
      case 'guest':
        return '/guest/dashboard';
      case 'agency':
        return '/agency/review';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }
}
