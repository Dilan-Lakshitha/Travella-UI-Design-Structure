import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import type {
  AgencyReviewRow,
  AdminDashboardResponse,
  StaffItineraryTab,
  CompanyItineraryRow,
  GuestItineraryRow,
  ItineraryDto,
  ItineraryDraftPayload,
  ItineraryFullApiResponse,
  ItineraryPricingPayload,
  ItineraryPricingDetail,
  ItineraryMessage,
  ItineraryConversation,
  AssignReviewerResult,
} from '../models/itinerary.models';

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  private baseUrl = `${API_BASE_URL}/api/itinerary`;
  private staffBaseUrl = `${API_BASE_URL}/api/staff`;
  private guestBaseUrl = `${API_BASE_URL}/api/guest`;
  private agencyBaseUrl = `${API_BASE_URL}/api/agency`;
  private companyBaseUrl = `${API_BASE_URL}/api/company`;
  private adminBaseUrl = `${API_BASE_URL}/api/admin`;
  private ownerBaseUrl = `${API_BASE_URL}/api/owner`;

  constructor(private http: HttpClient) {}

  async saveFromGoogle(place: any): Promise<number> {
    const response: any = await firstValueFrom(
      this.http.post(`${this.baseUrl}/save-from-google`, {
        placeId: place.placeId,
        name: place.name,
        address: place.address,
        latitude: place.lat,
        longitude: place.lng,
      }),
    );

    return response.id;
  }

  private mapFullToItineraryDto(full: ItineraryFullApiResponse): ItineraryDto {
    const byDayId = new Map<number, ItineraryDto['days'][0]>();

    for (const d of full.days ?? []) {
      byDayId.set(d.id, {
        dayNumber: d.dayNumber,
        overnightLocation: d.overnightLocation ?? '',
        attractions: [],
      });
    }

    for (const a of full.attractions ?? []) {
      const day = byDayId.get(a.itineraryDayId);
      if (!day) continue;
      day.attractions.push({
        name: a.name,
        address: a.address ?? '',
        latitude: a.latitude ?? 0,
        longitude: a.longitude ?? 0,
        description: a.description ?? '',
      });
    }

    const sortedDays = [...(full.days ?? [])].sort((x, y) => x.dayNumber - y.dayNumber);
    const days: ItineraryDto['days'] = sortedDays.map((d) => {
      const row = byDayId.get(d.id)!;
      const acc = (full.accommodations ?? []).find((c) => c.itineraryDayId === d.id);
      return {
        ...row,
        mealPlanCode: acc?.mealPlanCode ?? undefined,
        accommodationType: acc?.accommodationName ?? undefined,
      };
    });

    return {
      id: full.itinerary.id,
      startDate: full.itinerary.startDate,
      endDate: full.itinerary.endDate,
      status: full.itinerary.status,
      days,
      guestName: full.itinerary.guestName,
      rawStatus: full.itinerary.status,
      totalAmount: full.pricing?.totalAmount ?? full.itinerary.totalPrice,
      pricing: full.pricing ?? null,
    };
  }

  async createItinerary(payload: ItineraryDraftPayload): Promise<number> {
    const res: any = await firstValueFrom(this.http.post(this.baseUrl, payload));
    return res.id;
  }

  async updateItinerary(id: number, payload: ItineraryDraftPayload): Promise<void> {
    await firstValueFrom(this.http.put(`${this.baseUrl}/${id}`, payload));
  }

  async deleteDraftItinerary(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
  }

  async addDay(itineraryId: number, day: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/${itineraryId}/days`, day));
  }

  async addAttraction(itineraryId: number, attraction: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/${itineraryId}/attractions`, attraction));
  }

  async getGuestItineraries(): Promise<GuestItineraryRow[]> {
    return firstValueFrom(this.http.get<GuestItineraryRow[]>(`${this.guestBaseUrl}/itineraries`));
  }

  async getStaffReviewQueue(): Promise<AgencyReviewRow[]> {
    return firstValueFrom(this.http.get<AgencyReviewRow[]>(`${this.agencyBaseUrl}/review-itineraries`));
  }

  async getStaffItinerariesByTab(tab: StaffItineraryTab): Promise<AgencyReviewRow[]> {
    return firstValueFrom(
      this.http.get<AgencyReviewRow[]>(`${this.baseUrl}/staff`, { params: { tab } }),
    );
  }

  async assignReviewer(itineraryId: number): Promise<AssignReviewerResult> {
    return firstValueFrom(
      this.http.post<AssignReviewerResult>(`${this.baseUrl}/${itineraryId}/assign-reviewer`, {}),
    );
  }

  async startReview(itineraryId: number): Promise<AssignReviewerResult> {
    return firstValueFrom(
      this.http.post<AssignReviewerResult>(`${this.baseUrl}/${itineraryId}/start-review`, {}),
    );
  }

  async getCompanyItineraries(): Promise<CompanyItineraryRow[]> {
    return firstValueFrom(this.http.get<CompanyItineraryRow[]>(`${this.companyBaseUrl}/itineraries`));
  }

  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    return firstValueFrom(this.http.get<AdminDashboardResponse>(`${this.adminBaseUrl}/dashboard`));
  }

  async getOwnerSubmittedItineraries(): Promise<CompanyItineraryRow[]> {
    return firstValueFrom(this.http.get<CompanyItineraryRow[]>(`${this.ownerBaseUrl}/submitted-itineraries`));
  }

  async getItinerary(id: number): Promise<ItineraryDto> {
    const full = await firstValueFrom(this.http.get<ItineraryFullApiResponse>(`${this.baseUrl}/${id}`));
    return this.mapFullToItineraryDto(full);
  }

  getItineraryRaw(id: number) {
    return firstValueFrom(this.http.get<ItineraryFullApiResponse>(`${this.baseUrl}/${id}`));
  }

  async submitItinerary(itineraryId: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/${itineraryId}/submit`, {}));
  }

  async resubmitItinerary(itineraryId: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/${itineraryId}/resubmit`, {}));
  }

  readApiError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as any;
      if (body && typeof body === 'object' && typeof body.error === 'string') {
        return body.error;
      }
      return err.message || 'Request failed.';
    }
    return 'Request failed.';
  }

  async approveItinerary(itineraryId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/approve`, { itineraryId }));
  }

  async rejectItinerary(itineraryId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/${itineraryId}/reject`, {}));
  }

  async confirmItinerary(itineraryId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/confirm`, { itineraryId }));
  }

  async reviewItinerary(payload: { itineraryId: number; comments: string; status: string }): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/review`, payload));
  }

  async createPricing(payload: ItineraryPricingPayload): Promise<ItineraryPricingDetail> {
    return firstValueFrom(this.http.post<ItineraryPricingDetail>(`${this.baseUrl}/pricing`, payload));
  }

  async getItineraryPricing(itineraryId: number): Promise<ItineraryPricingDetail | null> {
    try {
      return await firstValueFrom(
        this.http.get<ItineraryPricingDetail>(`${this.baseUrl}/${itineraryId}/pricing`),
      );
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async assignDriverGuide(itineraryId: number, driverId: number, guideId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/assign`, { itineraryId, driverId, guideId }));
  }

  async sendToAdmin(itineraryId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/${itineraryId}/send-to-admin`, {}));
  }

  async adminApprove(itineraryId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/admin-approve`, { itineraryId }));
  }

  async adminReject(itineraryId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/admin-reject`, { itineraryId }));
  }

  async getConversation(itineraryId: number): Promise<ItineraryConversation> {
    return firstValueFrom(this.http.get<ItineraryConversation>(`${this.baseUrl}/${itineraryId}/messages`));
  }

  async getMessages(itineraryId: number): Promise<ItineraryMessage[]> {
    const conversation = await this.getConversation(itineraryId);
    return conversation.messages ?? [];
  }

  async addMessage(
    itineraryId: number,
    message: string,
    type: 'REQUEST_CHANGE' | 'COMMENT' | 'INTERNAL_NOTE' = 'COMMENT',
  ): Promise<ItineraryMessage> {
    return firstValueFrom(
      this.http.post<ItineraryMessage>(`${this.baseUrl}/${itineraryId}/messages`, { message, type }),
    );
  }

  async requestCorrection(itineraryId: number, message: string): Promise<any> {
    return this.returnItineraryForCorrection(itineraryId, message);
  }

  async returnItineraryForCorrection(itineraryId: number, message: string): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/${itineraryId}/return`, { message, type: 'REQUEST_CHANGE' }),
    );
  }

  async updatePricingMargin(itineraryId: number, profitMargin: number): Promise<ItineraryPricingDetail> {
    return firstValueFrom(
      this.http.put<ItineraryPricingDetail>(`${API_BASE_URL}/api/pricing/update-margin`, { itineraryId, profitMargin }),
    );
  }

  async getAvailableStaff(startDate: string, endDate: string, role: 'DRIVER' | 'GUIDE'): Promise<any[]> {
    const params = { startDate, endDate, role };
    return firstValueFrom(this.http.get<any[]>(`${this.staffBaseUrl}/available`, { params }));
  }
}
