export type UserRole = 'TRAVELER' | 'STAFF' | 'ADMIN';

export type ItineraryStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED_BY_STAFF'
  | 'PRICED'
  | 'SENT_TO_ADMIN'
  | 'APPROVED_BY_ADMIN'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'REQUESTED_CHANGES';

export interface AttractionDto {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface DayDto {
  dayNumber: number;
  overnightLocation: string;
  attractions: AttractionDto[];
  mealPlanCode?: string;
  accommodationType?: string;
}

export interface ItineraryDto {
  id: number;
  startDate: string;
  endDate: string;
  status: string; // backend string; UI can map to badges
  days: DayDto[];

  // Optional fields returned by list endpoints / expanded DTOs
  tripName?: string;
  destination?: string;
  daysCount?: number;
  guestName?: string;
  submittedDate?: string;
  rawStatus?: string;
  totalAmount?: number;
  driverId?: number | null;
  guideId?: number | null;
}

/** GET /api/itinerary/{id} full payload */
export interface ItineraryFullApiResponse {
  itinerary: {
    id: number;
    guestId: number;
    guestName: string;
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
    companyId: number | null;
  };
  days: Array<{ id: number; dayNumber: number; overnightLocation: string }>;
  attractions: Array<{
    id: number;
    itineraryDayId: number;
    attractionId: number;
    name: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    description?: string | null;
    durationHours: number;
  }>;
  accommodations: Array<{
    id: number;
    itineraryDayId: number;
    accommodationId: number;
    accommodationName?: string | null;
    mealPlanId: number;
    mealPlanCode?: string | null;
  }>;
}

export interface ItineraryDraftDayPayload {
  dayNumber: number;
  overnightLocation: string;
  mealPlanCode?: string | null;
  accommodationType?: string | null;
  attractions: Array<{
    attractionId: number;
    description?: string | null;
    durationHours: number;
  }>;
}

export interface ItineraryDraftPayload {
  startDate: string;
  endDate: string;
  days: ItineraryDraftDayPayload[];
}

export interface ItineraryPricingPayload {
  itineraryId: number;
  driverCost: number;
  guideCost: number;
  vehicleCost: number;
  mileageRate: number;
  totalKm: number;
  accommodationCost: number;
  mealPlan: string;
  profitMargin: number;
  totalAmount: number;
}

export interface GuestItineraryRow {
  id: number;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  daysCount: number;
  totalPrice?: number | null;
  lastMessagePreview?: string | null;
}

export interface AgencyReviewRow {
  id: number;
  guestName: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  submittedDate: string;
  status: string;
}

export interface CompanyItineraryRow {
  id: number;
  tripName: string;
  guestName: string;
  destination: string;
  startDate: string;
  endDate?: string;
  status: string;
  rawStatus: string;
  daysCount: number;
  totalAmount?: number;
  companyId?: number | null;
  profitMargin?: number | null;
}

export interface ItineraryMessage {
  id: number;
  itineraryId: number;
  senderId: number;
  senderRole: 'TRAVELER' | 'STAFF' | 'ADMIN' | string;
  message: string;
  type: 'REQUEST_CHANGE' | 'COMMENT' | string;
  createdAt: string;
}

