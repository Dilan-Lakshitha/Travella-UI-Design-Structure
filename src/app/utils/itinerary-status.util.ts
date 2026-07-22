export type TravelerDashboardTab = 'draft' | 'submitted' | 'returned' | 'approved' | 'rejected';

const normalize = (status: string | null | undefined): string =>
  String(status ?? '').toLowerCase().trim();

export const itineraryStatusLabel = (status: string | null | undefined): string => {
  switch (normalize(status)) {
    case 'submitted':
      return 'Pending Review';
    case 'under_review':
      return 'In Review';
    case 'returned_for_correction':
      return 'Returned';
    case 'resubmitted':
      return 'Resubmitted';
    case 'priced':
      return 'Priced';
    case 'approved_by_staff':
      return 'Approved by Staff';
    case 'sent_to_admin':
      return 'Awaiting Approval';
    case 'approved_by_admin':
      return 'Approved';
    case 'confirmed':
      return 'Confirmed';
    case 'rejected':
      return 'Rejected';
    case 'draft':
      return 'Draft';
    default:
      return status || 'Unknown';
  }
};

export const itineraryStatusClass = (status: string | null | undefined): string => {
  switch (normalize(status)) {
    case 'draft':
      return 'bg-gray-200 text-gray-800 border border-gray-300';
    case 'submitted':
      return 'bg-blue-100 text-blue-900 border border-blue-200';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-900 border border-yellow-300';
    case 'returned_for_correction':
      return 'bg-orange-100 text-orange-900 border border-orange-300';
    case 'resubmitted':
      return 'bg-orange-50 text-orange-800 border border-orange-200';
    case 'priced':
      return 'bg-purple-100 text-purple-900 border border-purple-200';
    case 'approved_by_staff':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    case 'approved_by_admin':
      return 'bg-green-100 text-green-900 border border-green-300';
    case 'sent_to_admin':
      return 'bg-teal-100 text-teal-900 border border-teal-300';
    case 'confirmed':
      return 'bg-green-800 text-white border border-green-900';
    case 'rejected':
      return 'bg-red-100 text-red-900 border border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

export const isTravelerEditable = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'draft' || s === 'returned_for_correction';
};

export const isFinalReadOnly = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'approved_by_admin' || s === 'confirmed';
};

export const travelerTabForStatus = (status: string | null | undefined): TravelerDashboardTab => {
  const s = normalize(status);
  if (s === 'draft') return 'draft';
  if (s === 'submitted' || s === 'under_review') return 'submitted';
  if (s === 'returned_for_correction' || s === 'resubmitted') return 'returned';
  if (s === 'rejected') return 'rejected';
  return 'approved';
};

/** Matches backend ItineraryConversationRules — button visibility only. */
export const canTravelerOpenConversation = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'returned_for_correction' || s === 'resubmitted';
};

/** Matches backend ItineraryConversationRules — button visibility only. */
export const canStaffOpenConversation = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'returned_for_correction' || s === 'resubmitted';
};

export const canTravelerEditReturned = (status: string | null | undefined): boolean =>
  normalize(status) === 'returned_for_correction';

/** Staff may open the review dialog and take workflow actions. */
export const canStaffPerformReviewActions = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'submitted' || s === 'under_review' || s === 'resubmitted';
};

export const canStaffReturnForCorrection = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'under_review' || s === 'resubmitted';
};

export const canStaffStartPricing = (status: string | null | undefined): boolean => {
  const s = normalize(status);
  return s === 'under_review' || s === 'resubmitted';
};

export const isResubmitted = (status: string | null | undefined): boolean =>
  normalize(status) === 'resubmitted';

export const isReturnedForCorrection = (status: string | null | undefined): boolean =>
  normalize(status) === 'returned_for_correction';
