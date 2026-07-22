import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../ui/card.component';
import {
  TableComponent,
  TableBodyComponent,
  TableCellComponent,
  TableHeadComponent,
  TableHeaderComponent,
  TableRowComponent,
} from '../ui/table.component';
import { InputComponent, LabelComponent } from '../ui/input.component';
import { SelectComponent, SelectOption } from '../ui/select.component';
import { BookingAvailabilityCalendarComponent } from '../booking-availability-calendar/booking-availability-calendar.component';
import { CalendarService } from '../../services/calendar.service';
import { AdminService } from '../../services/admin.service';
import { StaffService } from '../../services/staff.service';
import type { ItineraryBookingCalendarItem, StaffBookingCalendarItem } from '../../models/calendar.models';
import type { DriverDto, GuideDto } from '../../models/staff.models';
import { itineraryStatusClass } from '../../utils/itinerary-status.util';

type CalendarView = 'driver' | 'guide' | 'itineraries';

@Component({
  selector: 'app-admin-booking-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    InputComponent,
    LabelComponent,
    SelectComponent,
    BookingAvailabilityCalendarComponent,
  ],
  templateUrl: './admin-booking-calendar.component.html',
  styleUrls: ['./admin-booking-calendar.component.scss'],
})
export class AdminBookingCalendarComponent implements OnInit {
  @Input() initialView: CalendarView = 'itineraries';
  /** When true, loads drivers/guides via staff API (for STAFF role pages). */
  @Input() staffMode = false;

  private calendarService = inject(CalendarService);
  private adminService = inject(AdminService);
  private staffService = inject(StaffService);

  readonly views = [
    { id: 'driver' as CalendarView, label: 'Driver calendar' },
    { id: 'guide' as CalendarView, label: 'Guide calendar' },
    { id: 'itineraries' as CalendarView, label: 'Booked itineraries' },
  ];

  activeView: CalendarView = 'itineraries';
  startDate = '';
  endDate = '';
  filterStaffId = '';
  filterDriverId = '';
  filterGuideId = '';

  staffBookings: StaffBookingCalendarItem[] = [];
  itineraryBookings: ItineraryBookingCalendarItem[] = [];
  staffFilterOptions: SelectOption[] = [{ value: '', label: 'All staff' }];
  driverFilterOptions: SelectOption[] = [{ value: '', label: 'All drivers' }];
  guideFilterOptions: SelectOption[] = [{ value: '', label: 'All guides' }];

  isLoading = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    this.activeView = this.initialView;
    const today = new Date();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.startDate = this.toInputDate(today);
    this.endDate = this.toInputDate(monthEnd);

    try {
      const [drivers, guides] = await Promise.all([
        this.staffMode ? this.staffService.getDrivers() : this.adminService.getDrivers(),
        this.staffMode ? this.staffService.getGuides() : this.adminService.getGuides(),
      ]);
      this.driverFilterOptions = [
        { value: '', label: 'All drivers' },
        ...(drivers ?? []).map((d: DriverDto) => ({ value: String(d.id), label: d.name })),
      ];
      this.guideFilterOptions = [
        { value: '', label: 'All guides' },
        ...(guides ?? []).map((g: GuideDto) => ({
          value: String(g.id),
          label: g.language ? `${g.name} (${g.language})` : g.name,
        })),
      ];
      this.updateStaffFilterOptions(drivers ?? [], guides ?? []);
    } catch {
      // optional filters
    }

    await this.load();
  }

  get selectedStaffId(): number | null {
    return this.filterStaffId ? Number(this.filterStaffId) : null;
  }

  get calendarTitle(): string {
    if (this.filterStaffId) {
      const label = this.staffFilterOptions.find((o) => o.value === this.filterStaffId)?.label;
      return label ? `${label} — availability` : 'Staff availability';
    }
    return this.activeView === 'driver' ? 'All drivers — availability' : 'All guides — availability';
  }

  get filteredStaffBookings(): StaffBookingCalendarItem[] {
    if (!this.filterStaffId) {
      return this.staffBookings;
    }
    const id = Number(this.filterStaffId);
    return this.staffBookings.filter((r) => r.staffId === id);
  }

  setView(view: CalendarView): void {
    this.activeView = view;
    this.filterStaffId = '';
    void this.load();
  }

  async load(): Promise<void> {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Start and end dates are required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    try {
      if (this.activeView === 'itineraries') {
        this.itineraryBookings = await this.calendarService.getItineraryBookings({
          startDate: this.startDate,
          endDate: this.endDate,
          driverId: this.filterDriverId ? Number(this.filterDriverId) : undefined,
          guideId: this.filterGuideId ? Number(this.filterGuideId) : undefined,
        });
      } else {
        const role = this.activeView === 'driver' ? 'DRIVER' : 'GUIDE';
        this.staffBookings = await this.calendarService.getStaffBookings(
          this.startDate,
          this.endDate,
          role,
        );
        this.updateStaffFilterOptionsForRole(role);
      }
    } catch {
      this.errorMessage = 'Failed to load calendar data.';
      this.staffBookings = [];
      this.itineraryBookings = [];
    } finally {
      this.isLoading = false;
    }
  }

  readonly itineraryStatusClass = itineraryStatusClass;

  formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString();
  }

  trackStaffRow(row: StaffBookingCalendarItem): string {
    return `${row.staffId}-${row.itineraryId ?? 0}-${row.availabilityStatus}`;
  }

  availabilityClass(status: string): string {
    switch (status) {
      case 'BOOKED':
        return 'bg-rose-100 text-rose-800';
      case 'UNAVAILABLE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  }

  dateRangeLabel(row: StaffBookingCalendarItem): string {
    if (row.startDate && row.endDate) {
      return `${this.formatDate(row.startDate)} – ${this.formatDate(row.endDate)}`;
    }
    return '—';
  }

  private updateStaffFilterOptions(drivers: DriverDto[], guides: GuideDto[]): void {
    if (this.activeView === 'driver') {
      this.staffFilterOptions = [
        { value: '', label: 'All drivers' },
        ...drivers.map((d) => ({ value: String(d.id), label: d.name })),
      ];
    } else if (this.activeView === 'guide') {
      this.staffFilterOptions = [
        { value: '', label: 'All guides' },
        ...guides.map((g) => ({
          value: String(g.id),
          label: g.language ? `${g.name} (${g.language})` : g.name,
        })),
      ];
    }
  }

  private updateStaffFilterOptionsForRole(role: 'DRIVER' | 'GUIDE'): void {
    const names = new Map<number, string>();
    for (const row of this.staffBookings) {
      if (row.role === role) {
        names.set(row.staffId, row.staffName);
      }
    }
    const options = Array.from(names.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ value: String(id), label: name }));
    this.staffFilterOptions = [
      { value: '', label: role === 'DRIVER' ? 'All drivers' : 'All guides' },
      ...options,
    ];
  }

  private toInputDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
