import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL, DEFAULT_TRAVELER_COMPANY_ID } from '../config/api.config';
import type { UserRole } from '../models/itinerary.models';

export type { UserRole };

export interface User {
  userId?: number;
  email?: string;
  role: UserRole;
  companyId: number | null;
  isFirstLogin?: boolean;
}

interface RegisterTravelerRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyId: number;
}

interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole | string;
}

interface AuthResponse {
  token: string;
  role: UserRole | string;
  companyId: number | null;
  userId?: number;
  email?: string;
  expiresAtUtc?: string;
  isFirstLogin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = `${API_BASE_URL}/api/auth`;
  private readonly tokenKey = 'travella.jwt';
  private readonly userKey = 'travella.user';
  private http = inject(HttpClient);
  private userSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal(false);

  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  userRole = computed(() => this.userSignal()?.role ?? null);
  mustResetPassword = computed(() => Boolean(this.userSignal()?.isFirstLogin));

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);

    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      this.userSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  private normalizeRole(role: unknown): UserRole | null {
    const r = String(role ?? '').toUpperCase().trim();
    if (r === 'TRAVELER') return 'TRAVELER';
    if (r === 'STAFF') return 'STAFF';
    if (r === 'ADMIN') return 'ADMIN';
    return null;
  }

  async login(email: string, password: string, role: UserRole): Promise<boolean> {
    const payload: LoginRequest = { email, password, role };

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/login`, payload)
      );

      localStorage.setItem(this.tokenKey, response.token);
      const normalizedRole = this.normalizeRole(response.role) ?? role;

      const user: User = {
        userId: response.userId,
        email: response.email,
        role: normalizedRole,
        companyId: response.companyId,
        isFirstLogin: Boolean(response.isFirstLogin)
      };

      localStorage.setItem(this.userKey, JSON.stringify(user));
      this.userSignal.set(user);
      this.isAuthenticatedSignal.set(true);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  async registerTraveler(name: string, email: string, password: string, phone?: string): Promise<boolean> {
    const payload: RegisterTravelerRequest = {
      name,
      email,
      password,
      phone,
      companyId: DEFAULT_TRAVELER_COMPANY_ID,
    };

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiBaseUrl}/register/traveler`, payload)
      );

      localStorage.setItem(this.tokenKey, response.token);
      const normalizedRole = this.normalizeRole(response.role) ?? 'TRAVELER';

      const user: User = {
        userId: response.userId,
        email: response.email,
        role: normalizedRole,
        companyId: response.companyId,
        isFirstLogin: Boolean(response.isFirstLogin)
      };

      localStorage.setItem(this.userKey, JSON.stringify(user));
      this.userSignal.set(user);
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

  async resetPassword(newPassword: string): Promise<void> {
    const email = this.userSignal()?.email;
    if (!email) {
      throw new Error('Missing user email.');
    }

    await firstValueFrom(
      this.http.post(`${this.apiBaseUrl}/reset-password`, {
        email,
        newPassword
      })
    );

    const current = this.userSignal();
    if (current) {
      const updated = { ...current, isFirstLogin: false };
      localStorage.setItem(this.userKey, JSON.stringify(updated));
      this.userSignal.set(updated);
    }
  }

  getRedirectUrl(role: UserRole): string {
    switch (role) {
      case 'TRAVELER':
        return '/guest/dashboard';
      case 'STAFF':
        return '/agency/review';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    return this.userSignal();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSignal();
  }
}
