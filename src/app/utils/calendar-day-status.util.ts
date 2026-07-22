import type { StaffBookingCalendarItem } from '../models/calendar.models';

export type CalendarDayStatus = 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';

const UNAVAILABLE_PROFILES = new Set(['OFF_DUTY', 'ON_TRIP', 'UNAVAILABLE']);

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function eachDayInRange(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    days.push(toDateKey(cursor));
  }
  return days;
}

function overlapsRange(
  dayKey: string,
  start?: string | null,
  end?: string | null,
): boolean {
  if (!start || !end) return false;
  return dayKey >= start.slice(0, 10) && dayKey <= end.slice(0, 10);
}

function isBookedRow(row: StaffBookingCalendarItem): boolean {
  return row.availabilityStatus === 'BOOKED' || row.bookedStatus === 'BOOKED';
}

function isUnavailableProfile(status?: string | null): boolean {
  if (!status) return false;
  return UNAVAILABLE_PROFILES.has(status.trim().toUpperCase());
}

/** Build per-day status for one staff member or all staff when staffId is omitted. */
export function buildDayStatusMap(
  startDate: string,
  endDate: string,
  rows: StaffBookingCalendarItem[],
  staffId?: number | null,
): Map<string, CalendarDayStatus> {
  const map = new Map<string, CalendarDayStatus>();
  const scoped = staffId
    ? rows.filter((r) => r.staffId === staffId)
    : rows;

  const bookedRows = scoped.filter(isBookedRow);
  const profileRows = scoped.filter((r) => !isBookedRow(r));

  for (const dayKey of eachDayInRange(startDate, endDate)) {
    const booked = bookedRows.some((row) =>
      overlapsRange(dayKey, row.startDate ?? null, row.endDate ?? null),
    );
    if (booked) {
      map.set(dayKey, 'BOOKED');
      continue;
    }

    if (staffId) {
      const profile = profileRows.find((r) => r.staffId === staffId);
      if (profile && isUnavailableProfile(profile.availabilityStatus)) {
        map.set(dayKey, 'UNAVAILABLE');
        continue;
      }
    } else {
      const anyUnavailable = profileRows.some((r) => isUnavailableProfile(r.availabilityStatus));
      const anyAvailable = profileRows.some((r) => !isUnavailableProfile(r.availabilityStatus));
      if (anyUnavailable && !anyAvailable && profileRows.length > 0) {
        map.set(dayKey, 'UNAVAILABLE');
        continue;
      }
    }

    map.set(dayKey, 'AVAILABLE');
  }

  return map;
}

export function dayStatusClass(status: CalendarDayStatus): string {
  switch (status) {
    case 'BOOKED':
      return 'bg-rose-200 text-rose-900 border-rose-300 font-semibold';
    case 'UNAVAILABLE':
      return 'bg-gray-200 text-gray-700 border-gray-300';
    default:
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  }
}
