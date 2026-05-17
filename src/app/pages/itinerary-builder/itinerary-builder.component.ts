import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LayoutComponent } from "../../components/layout/layout.component";
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from "../../components/ui/card.component";
import { InputComponent, LabelComponent } from "../../components/ui/input.component";
import {
  SelectComponent,
} from "../../components/ui/select.component";
import { IconComponent } from "../../components/ui/icons.component";
import { ToastService } from "../../services/toast.service";
import { ItineraryService } from "@app/services/itinerary.service";
import type { ItineraryDraftPayload, ItineraryFullApiResponse } from "@app/models/itinerary.models";
import {
  canTravelerEditReturned,
  itineraryStatusClass,
  itineraryStatusLabel,
} from "../../utils/itinerary-status.util";

interface DayPlan {
  id: number;
  dayNumber: number;
  destination: string;
  attractions: any[];
  mealPlan: string | null;
  accommodation: string | null;
  expanded: boolean;
}

declare var google: any;

@Component({
  selector: "app-itinerary-builder",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    InputComponent,
    LabelComponent,
    SelectComponent,
    IconComponent,
  ],
  templateUrl: "./itinerary-builder.component.html",
  styleUrls: ["./itinerary-builder.component.scss"],
})
export class ItineraryBuilderComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private itineraryService: ItineraryService,
  ) {}

  tripName = "";
  startDate = "";
  endDate = "";

  itineraryId: number | null = null;
  itineraryStatus: string | null = null;

  isLoadingDraft = false;
  isSavingDraft = false;
  isSubmitting = false;
  isSavingAttraction = false;

  readonly itineraryStatusClass = itineraryStatusClass;
  readonly itineraryStatusLabel = itineraryStatusLabel;

  days: DayPlan[] = [
    {
      id: 1,
      dayNumber: 1,
      destination: "",
      attractions: [
        {
          name: "",
          placeId: "",
          lat: null,
          lng: null,
          id: null,
        },
      ],
      mealPlan: "BB",
      accommodation: "",
      expanded: true,
    },
  ];

  mealPlanOptions = [
    { value: null, label: "No Meal Plan" },
    { value: "BB", label: "Bed & Breakfast (BB)" },
    { value: "HB", label: "Half Board (HB)" },
    { value: "FB", label: "Full Board (FB)" },
    { value: "AI", label: "All Inclusive (AI)" },
  ];

  accommodationOptions = [
    { value: null, label: "No Accommodation" },
    { value: "Hotel", label: "Hotel" },
    { value: "Resort", label: "Resort" },
    { value: "Hostel", label: "Hostel" },
    { value: "Villa", label: "Villa" },
    { value: "Apartment", label: "Apartment" },
  ];

  get isBusy(): boolean {
    return (
      this.isLoadingDraft ||
      this.isSavingDraft ||
      this.isSubmitting ||
      this.isSavingAttraction
    );
  }

  get loadingMessage(): string {
    if (this.isLoadingDraft) return "Loading your itinerary…";
    if (this.isSavingDraft) return "Saving draft…";
    if (this.isSubmitting) return "Submitting itinerary…";
    if (this.isSavingAttraction) return "Saving attraction…";
    return "Working…";
  }

  get scheduledTripDays(): number | null {
    if (!this.startDate || !this.endDate) return null;
    const start = new Date(`${this.startDate}T12:00:00`);
    const end = new Date(`${this.endDate}T12:00:00`);
    if (end < start) return null;
    return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  }

  get totalAttractions(): number {
    return this.days.reduce(
      (sum, day) =>
        sum +
        day.attractions.filter((a) => (typeof a.id === "number" && a.id > 0) || !!a.name?.trim()).length,
      0,
    );
  }

  get mealPlanSummary(): string {
    const counts = new Map<string, number>();
    for (const day of this.days) {
      const label =
        this.mealPlanOptions.find((o) => o.value === (day.mealPlan ?? ""))?.label ?? "No meal plan";
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    const parts = [...counts.entries()].map(([label, count]) => `${count}× ${label}`);
    return parts.length ? parts.join(" · ") : "Not set yet";
  }

  get displayTripName(): string {
    return this.tripName.trim() || "Untitled trip";
  }

  get isEndBeforeStart(): boolean {
    if (!this.startDate || !this.endDate) return false;
    return new Date(this.endDate) < new Date(this.startDate);
  }

  private guestBase(): string {
    return this.router.url.includes("/traveler/") ? "/traveler" : "/guest";
  }

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        this.toastService.error("Invalid itinerary id.");
        await this.router.navigate([`${this.guestBase()}/dashboard`]);
        return;
      }
      this.itineraryId = parsed;
      await this.loadDraft(parsed);
    }
  }

  formatDisplayDate(value: string): string {
    if (!value) return "—";
    return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  attractionCount(day: DayPlan): number {
    return day.attractions.filter(
      (a) => (typeof a.id === "number" && a.id > 0) || !!a.name?.trim(),
    ).length;
  }

  mealPlanLabel(code: string | null): string {
    return this.mealPlanOptions.find((o) => o.value === (code ?? ""))?.label ?? "—";
  }

  private async loadDraft(id: number): Promise<void> {
    this.isLoadingDraft = true;
    try {
      const full = await this.itineraryService.getItineraryRaw(id);
      this.applyFullResponse(full);
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
      await this.router.navigate([`${this.guestBase()}/dashboard`]);
    } finally {
      this.isLoadingDraft = false;
    }
  }

  private applyFullResponse(full: ItineraryFullApiResponse): void {
    this.itineraryStatus = full.itinerary.status ?? null;
    this.tripName = `Trip ${full.itinerary.id}`;
    this.startDate = (full.itinerary.startDate as string)?.substring(0, 10) ?? "";
    this.endDate = (full.itinerary.endDate as string)?.substring(0, 10) ?? "";

    const sortedDays = [...(full.days ?? [])].sort((a, b) => a.dayNumber - b.dayNumber);
    this.days = sortedDays.map((d, idx) => {
      const atts = (full.attractions ?? []).filter((a) => a.itineraryDayId === d.id);
      const acc = (full.accommodations ?? []).find((c) => c.itineraryDayId === d.id);
      console.log('meal plan',acc);
      const accommodationValue = acc?.accommodationName &&
        this.accommodationOptions.some((o) => o.value === acc.accommodationName) ? acc.accommodationName! : (acc?.accommodationName?.toLowerCase() ?? "");

        console.log('accomdation',accommodationValue);
      return {
        id: idx + 1,
        dayNumber: d.dayNumber,
        destination: d.overnightLocation ?? "",
        attractions: atts.length
          ? atts.map((a) => ({
              name: a.name ?? "",
              placeId: "",
              lat: a.latitude ?? null,
              lng: a.longitude ?? null,
              id: a.attractionId,
              address: a.address ?? "",
            }))
          : [
              {
                name: "",
                placeId: "",
                lat: null,
                lng: null,
                id: null,
              },
            ],
        mealPlan: (acc?.mealPlanCode || "BB").substring(0, 2).toUpperCase(),
        accommodation: accommodationValue,
        expanded: idx === 0,
      };
    });

    if (this.days.length === 0) {
      this.days = [
        {
          id: 1,
          dayNumber: 1,
          destination: "",
          attractions: [{ name: "", placeId: "", lat: null, lng: null, id: null }],
          mealPlan: "BB",
          accommodation: "",
          expanded: true,
        },
      ];
    }
  }

  toggleDay(day: DayPlan): void {
    day.expanded = !day.expanded;
  }

  addDay(): void {
    const newDay: DayPlan = {
      id: this.days.length + 1,
      dayNumber: this.days.length + 1,
      destination: "",
      attractions: [
        {
          name: "",
          placeId: "",
          lat: null,
          lng: null,
          id: null,
        },
      ],
      mealPlan: null,
      accommodation: null,
      expanded: true,
    };
    this.days.push(newDay);
  }

  removeDay(id: number): void {
    if (this.days.length > 1) {
      this.days = this.days.filter((d) => d.id !== id);
      this.days.forEach((day, index) => {
        day.dayNumber = index + 1;
      });
    }
  }

  addAttraction(day: DayPlan): void {
    day.attractions.push({
      name: "",
      placeId: "",
      lat: null,
      lng: null,
      id: null,
    });
  }

  removeAttraction(day: DayPlan, index: number): void {
    day.attractions.splice(index, 1);
  }

  private buildDraftPayload(): ItineraryDraftPayload {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
      days: this.days.map((d) => ({
        dayNumber: d.dayNumber,
        overnightLocation: d.destination ?? "",
        mealPlanCode: d.mealPlan,
        accommodationType: d.accommodation?.trim() ? d.accommodation : "General",
        attractions: d.attractions
          .filter((a) => typeof a.id === "number" && a.id > 0)
          .map((a) => ({
            attractionId: a.id as number,
            description: a.name,
            durationHours: 2,
          })),
      })),
    };
  }

  async handleSaveDraft(): Promise<void> {
    if (this.isBusy) return;

    if (!this.startDate || !this.endDate) {
      this.toastService.error("Please select start and end dates.");
      return;
    }
    if (new Date(this.endDate) < new Date(this.startDate)) {
      this.toastService.error("End date must be on or after start date.");
      return;
    }

    this.isSavingDraft = true;
    try {
      const payload = this.buildDraftPayload();
      if (this.itineraryId) {
        await this.itineraryService.updateItinerary(this.itineraryId, payload);
        this.itineraryStatus = this.itineraryStatus ?? "draft";
        this.toastService.success("Draft saved.");
      } else {
        const id = await this.itineraryService.createItinerary(payload);
        this.itineraryId = id;
        this.itineraryStatus = "draft";
        this.toastService.success("Draft saved.");
        await this.router.navigate([`${this.guestBase()}/itinerary-builder`, id], {
          replaceUrl: true,
        });
      }
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.isSavingDraft = false;
    }
  }

  async handleSubmit(): Promise<void> {
    if (this.isBusy) return;

    if (this.days.length < 1) {
      this.toastService.error("Add at least one day before submitting.");
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.toastService.error("Please select start and end dates.");
      return;
    }

    this.isSubmitting = true;
    try {
      const payload = this.buildDraftPayload();
      if (!this.itineraryId) {
        const id = await this.itineraryService.createItinerary(payload);
        this.itineraryId = id;
      } else {
        await this.itineraryService.updateItinerary(this.itineraryId, payload);
      }

      const wasReturned = canTravelerEditReturned(this.itineraryStatus);
      if (wasReturned) {
        await this.itineraryService.resubmitItinerary(this.itineraryId!);
        this.itineraryStatus = "resubmitted";
        this.toastService.success("Itinerary resubmitted for review.");
      } else {
        await this.itineraryService.submitItinerary(this.itineraryId!);
        this.itineraryStatus = "submitted";
        this.toastService.success("Itinerary submitted.");
      }
      await this.router.navigate([`${this.guestBase()}/dashboard`]);
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.isSubmitting = false;
    }
  }

  initAutocomplete(input: HTMLInputElement, day: DayPlan, index: number): void {
    if (this.isBusy) return;

    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", async () => {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) {
        console.error("Invalid place selected");
        return;
      }
      const attraction = {
        name: place.name,
        placeId: place.place_id,
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      this.isSavingAttraction = true;
      try {
        const attractionId = await this.itineraryService.saveFromGoogle(attraction);

        day.attractions[index] = {
          ...attraction,
          id: attractionId,
        };
        this.toastService.success("Attraction added.");
      } catch (error) {
        console.error("Failed to save attraction", error);
        this.toastService.error(this.itineraryService.readApiError(error));
      } finally {
        this.isSavingAttraction = false;
      }
    });
  }
}
