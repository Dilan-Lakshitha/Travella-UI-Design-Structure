import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type UserRole = 'traveler' | 'staff' | 'admin' | 'super_admin';

export interface User {
  userId: number;
  email: string;
  role: UserRole;
  companyId: number | null;
}

interface RegisterTravelerRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: UserRole;
  companyId: number | null;
  expiresAtUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = 'http://localhost:5094/api/auth';
  private readonly tokenKey = 'travella.jwt';
  private readonly userKey = 'travella.user';
  private http = inject(HttpClient);
  private userSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal(false);

  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  userRole = computed(() => this.userSignal()?.role ?? null);

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);

    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      this.userSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  async login(email: string, password: string, role: UserRole): Promise<boolean> {
    const payload: LoginRequest = { email, password, role };

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/login`, payload)
      );

      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify({
        userId: response.userId,
        email: response.email,
        role: response.role,
        companyId: response.companyId
      }));

      this.userSignal.set({
        userId: response.userId,
        email: response.email,
        role: response.role,
        companyId: response.companyId
      });
      this.isAuthenticatedSignal.set(true);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  async registerTraveler(name: string, email: string, password: string, phone?: string): Promise<boolean> {
    const payload: RegisterTravelerRequest = { name, email, password, phone };

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/register/traveler`, payload)
      );

      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify({
        userId: response.userId,
        email: response.email,
        role: response.role,
        companyId: response.companyId
      }));

      this.userSignal.set({
        userId: response.userId,
        email: response.email,
        role: response.role,
        companyId: response.companyId
      });
      this.isAuthenticatedSignal.set(true);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  getRedirectUrl(role: UserRole): string {
    switch (role) {
      case 'traveler':
        return '/guest/dashboard';
      case 'staff':
      case 'admin':
        return '/agency/review';
      case 'super_admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }

  getUser(): User | null {
    return this.userSignal();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSignal();
  }
}
