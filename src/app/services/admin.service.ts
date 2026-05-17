import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { DriverDto, GuideDto } from '../models/staff.models';

export interface StaffUserRow {
  userId: number;
  name: string;
  email: string;
}

export interface CreateStaffResponse {
  email: string;
  temporaryPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getStaffUsers(): Promise<StaffUserRow[]> {
    return firstValueFrom(this.http.get<StaffUserRow[]>(`${API_BASE_URL}/api/admin/staff`));
  }

  createStaff(name: string, email: string): Promise<CreateStaffResponse> {
    return firstValueFrom(
      this.http.post<CreateStaffResponse>(`${API_BASE_URL}/api/admin/staff`, { name, email })
    );
  }

  createDriver(payload: {
    name: string;
    phone: string;
    experience: number;
    availability: string;
    language: string;
    email?: string;
  }): Promise<{ id: number }> {
    return firstValueFrom(
      this.http.post<{ id: number }>(`${API_BASE_URL}/api/admin/drivers`, payload)
    );
  }

  createGuide(payload: {
    name: string;
    phone: string;
    experience: number;
    availability: string;
    language: string;
    email?: string;
  }): Promise<{ id: number }> {
    return firstValueFrom(
      this.http.post<{ id: number }>(`${API_BASE_URL}/api/admin/guides`, payload)
    );
  }

  getDrivers(): Promise<DriverDto[]> {
    return firstValueFrom(this.http.get<DriverDto[]>(`${API_BASE_URL}/api/drivers`));
  }

  getGuides(): Promise<GuideDto[]> {
    return firstValueFrom(this.http.get<GuideDto[]>(`${API_BASE_URL}/api/guides`));
  }
}

