export interface StaffBookingCalendarItem {
  staffId: number;
  staffName: string;
  role: string;
  language?: string | null;
  email?: string | null;
  availabilityStatus: string;
  itineraryId?: number | null;
  itineraryTitle?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  bookedStatus?: string | null;
  bookedDateRange?: string | null;
}

export interface ItineraryBookingCalendarItem {
  itineraryId: number;
  itineraryTitle: string;
  startDate: string;
  endDate: string;
  itineraryStatus: string;
  bookedDateRange?: string | null;
  driverId?: number | null;
  driverName?: string | null;
  driverLanguage?: string | null;
  driverEmail?: string | null;
  guideId?: number | null;
  guideName?: string | null;
  guideLanguage?: string | null;
  guideEmail?: string | null;
}
