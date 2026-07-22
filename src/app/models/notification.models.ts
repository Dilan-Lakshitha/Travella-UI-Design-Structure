export type NotificationType =
  | 'ITINERARY_CREATED'
  | 'ITINERARY_SUBMITTED'
  | 'ITINERARY_UNDER_REVIEW'
  | 'ITINERARY_RETURNED_FOR_CORRECTION'
  | 'ITINERARY_RESUBMITTED'
  | 'ITINERARY_PRICED'
  | 'ITINERARY_SENT_TO_ADMIN'
  | 'ITINERARY_APPROVED'
  | 'ITINERARY_CONFIRMED'
  | 'ITINERARY_REJECTED'
  | 'CONVERSATION_MESSAGE';

export interface AppNotification {
  id: number;
  userId: number;
  itineraryId: number | null;
  type: NotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
