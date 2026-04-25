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
  SelectOption,
} from "../../components/ui/select.component";
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
} from "../../components/ui/accordion.component";
import { IconComponent } from "../../components/ui/icons.component";
import { ToastService } from "../../services/toast.service";
import { ItineraryService } from "@app/services/itinerary.service";
import type { ItineraryDraftPayload, ItineraryFullApiResponse } from "@app/models/itinerary.models";

interface DayPlan {
  id: number;
  dayNumber: number;
  destination: string;
  attractions: any[];
  mealPlan: string;
  accommodation: string;
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
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
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
  isLoadingDraft = false;

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

  mealPlanOptions: SelectOption[] = [
    { value: "BB", label: "Bed & Breakfast (BB)" },
    { value: "HB", label: "Half Board (HB)" },
    { value: "FB", label: "Full Board (FB)" },
    { value: "AI", label: "All Inclusive (AI)" },
  ];

  accommodationOptions: SelectOption[] = [
    { value: "hotel", label: "Hotel" },
    { value: "resort", label: "Resort" },
    { value: "hostel", label: "Hostel" },
    { value: "villa", label: "Villa" },
    { value: "apartment", label: "Apartment" },
  ];

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
    this.tripName = `Trip ${full.itinerary.id}`;
    this.startDate = (full.itinerary.startDate as string)?.substring(0, 10) ?? "";
    this.endDate = (full.itinerary.endDate as string)?.substring(0, 10) ?? "";

    const sortedDays = [...(full.days ?? [])].sort((a, b) => a.dayNumber - b.dayNumber);
    this.days = sortedDays.map((d, idx) => {
      const atts = (full.attractions ?? []).filter((a) => a.itineraryDayId === d.id);
      const acc = (full.accommodations ?? []).find((c) => c.itineraryDayId === d.id);
      const accommodationValue =
        acc?.accommodationName && this.accommodationOptions.some((o) => o.value === acc.accommodationName)
          ? acc.accommodationName!
          : acc?.accommodationName?.toLowerCase() ?? "";

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
      mealPlan: "BB",
      accommodation: "",
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
    if (!this.startDate || !this.endDate) {
      this.toastService.error("Please select start and end dates.");
      return;
    }
    if (new Date(this.endDate) < new Date(this.startDate)) {
      this.toastService.error("End date must be on or after start date.");
      return;
    }

    try {
      const payload = this.buildDraftPayload();
      if (this.itineraryId) {
        await this.itineraryService.updateItinerary(this.itineraryId, payload);
        this.toastService.success("Draft saved.");
      } else {
        const id = await this.itineraryService.createItinerary(payload);
        this.itineraryId = id;
        this.toastService.success("Draft saved.");
        await this.router.navigate([`${this.guestBase()}/itinerary-builder`, id], { replaceUrl: true });
      }
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    }
  }

  async handleSubmit(): Promise<void> {
    if (this.days.length < 1) {
      this.toastService.error("Add at least one day before submitting.");
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.toastService.error("Please select start and end dates.");
      return;
    }

    try {
      const payload = this.buildDraftPayload();
      if (!this.itineraryId) {
        const id = await this.itineraryService.createItinerary(payload);
        this.itineraryId = id;
      } else {
        await this.itineraryService.updateItinerary(this.itineraryId, payload);
      }

      await this.itineraryService.submitItinerary(this.itineraryId!);
      this.toastService.success("Itinerary submitted.");
      await this.router.navigate([`${this.guestBase()}/dashboard`]);
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    }
  }

  initAutocomplete(input: HTMLInputElement, day: DayPlan, index: number) {
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

      try {
        const attractionId = await this.itineraryService.saveFromGoogle(attraction);

        day.attractions[index] = {
          ...attraction,
          id: attractionId,
        };
      } catch (error) {
        console.error("Failed to save attraction", error);
        this.toastService.error(this.itineraryService.readApiError(error));
      }
    });
  }
}
