import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { DriverDto, GuideDto } from '../models/staff.models';

@Injectable({ providedIn: 'root' })
export class StaffService {
  constructor(private http: HttpClient) {}

  getDrivers(): Promise<DriverDto[]> {
    return firstValueFrom(this.http.get<DriverDto[]>(`${API_BASE_URL}/api/drivers`));
  }

  getGuides(): Promise<GuideDto[]> {
    return firstValueFrom(this.http.get<GuideDto[]>(`${API_BASE_URL}/api/guides`));
  }
}

