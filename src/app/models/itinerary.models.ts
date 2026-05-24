export type UserRole = 'TRAVELER' | 'STAFF' | 'ADMIN';

export type TravelerDashboardTab = 'draft' | 'submitted' | 'returned' | 'approved' | 'rejected';

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
  status: string;
  days: DayDto[];
  tripName?: string;
  destination?: string;
  daysCount?: number;
  guestName?: string;
  submittedDate?: string;
  rawStatus?: string;
  totalAmount?: number;
  pricing?: ItineraryPricingDetail | null;
  driverId?: number | null;
  guideId?: number | null;
}

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
  pricing?: ItineraryPricingDetail | null;
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

export interface ItineraryPricingDetail {
  id: number;
  itineraryId: number;
  createdBy: number;
  driverCost: number;
  guideCost: number;
  vehicleCost: number;
  mileageRate: number;
  totalKm: number;
  accommodationCost: number;
  mealPlan: string;
  profitMargin: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface GuestItineraryRow {
  id: number;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  rawStatus?: string;
  daysCount: number;
  totalPrice?: number | null;
  submittedDate?: string | null;
  lastMessagePreview?: string | null;
}

export type StaffItineraryTab =
  | 'pending'
  | 'in-review'
  | 'returned'
  | 'priced'
  | 'approved'
  | 'completed'
  | 'rejected';

export interface AgencyReviewRow {
  id: number;
  guestName: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  submittedDate?: string | null;
  status: string;
  rawStatus?: string;
  totalPrice?: number | null;
  lastMessagePreview?: string | null;
  pricing?: ItineraryPricingDetail | null;
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
  totalPrice?: number | null;
  companyId?: number | null;
  profitMargin?: number | null;
  submittedDate?: string | null;
  lastMessagePreview?: string | null;
}

export type AdminDashboardTab =
  | 'all'
  | 'pending-review'
  | 'in-review'
  | 'returned'
  | 'priced'
  | 'awaiting-approval'
  | 'approved'
  | 'confirmed'
  | 'rejected';

export interface AdminDashboardSections {
  all: AgencyReviewRow[];
  pendingReview: AgencyReviewRow[];
  inReview: AgencyReviewRow[];
  returned: AgencyReviewRow[];
  priced: AgencyReviewRow[];
  awaitingApproval: AgencyReviewRow[];
  approved: AgencyReviewRow[];
  confirmed: AgencyReviewRow[];
  rejected: AgencyReviewRow[];
}

export interface AdminDashboardResponse {
  totalItineraries: number;
  pendingReviewCount: number;
  awaitingApprovalCount: number;
  confirmedCount: number;
  statusCounts: Record<string, number>;
  sections: AdminDashboardSections;
}

export interface ItineraryMessage {
  id: number;
  itineraryId: number;
  senderId: number;
  senderName?: string;
  senderRole: 'TRAVELER' | 'STAFF' | 'ADMIN' | string;
  message: string;
  type: 'REQUEST_CHANGE' | 'COMMENT' | 'INTERNAL_NOTE' | string;
  createdAt: string;
}

export interface ItineraryConversation {
  messages: ItineraryMessage[];
  assignedReviewerId?: number | null;
  canViewConversation: boolean;
  canSendMessage: boolean;
}

export interface AssignReviewerResult {
  itineraryId: number;
  status: string;
  assignedReviewerId?: number | null;
  isCurrentUserReviewer: boolean;
  reviewerAssignedByThisRequest: boolean;
}

export interface ChatTypingUser {
  itineraryId: number;
  senderId: number;
  senderName: string;
  senderRole: string;
}