import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type { ItineraryBookingCalendarItem, StaffBookingCalendarItem } from '../models/calendar.models';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly baseUrl = `${API_BASE_URL}/api/admin/calendar`;

  constructor(private http: HttpClient) {}

  getStaffBookings(startDate: string, endDate: string, role?: 'DRIVER' | 'GUIDE'): Promise<StaffBookingCalendarItem[]> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    if (role) {
      params = params.set('role', role);
    }
    return firstValueFrom(this.http.get<StaffBookingCalendarItem[]>(`${this.baseUrl}/staff-bookings`, { params }));
  }

  getItineraryBookings(options: {
    startDate: string;
    endDate: string;
    date?: string;
    driverId?: number;
    guideId?: number;
  }): Promise<ItineraryBookingCalendarItem[]> {
    let params = new HttpParams()
      .set('startDate', options.startDate)
      .set('endDate', options.endDate);
    if (options.date) {
      params = params.set('date', options.date);
    }
    if (options.driverId) {
      params = params.set('driverId', String(options.driverId));
    }
    if (options.guideId) {
      params = params.set('guideId', String(options.guideId));
    }
    return firstValueFrom(this.http.get<ItineraryBookingCalendarItem[]>(`${this.baseUrl}/itinerary-bookings`, { params }));
  }
}
