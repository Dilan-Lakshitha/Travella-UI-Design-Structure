import { Component, HostListener, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../ui/icons.component';
import { NotificationService } from '../../services/notification.service';
import { AuthService, UserRole } from '../../services/auth.service';
import type { AppNotification } from '../../models/notification.models';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative" (click)="$event.stopPropagation()">
      <button
        type="button"
        class="btn btn-ghost btn-sm relative"
        (click)="togglePanel()"
        aria-label="Notifications"
      >
        <app-icon name="bell" [size]="18" />
        @if (notificationService.unreadCount() > 0) {
          <span
            class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center"
          >
            {{ badgeLabel() }}
          </span>
        }
      </button>

      @if (panelOpen) {
        <div
          class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <div class="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
            @if (notificationService.unreadCount() > 0) {
              <button
                type="button"
                class="text-xs text-blue-600 hover:text-blue-800"
                (click)="markAllRead($event)"
              >
                Mark all read
              </button>
            }
          </div>

          <div class="max-h-96 overflow-y-auto">
            @if (notificationService.notifications().length === 0) {
              <p class="px-4 py-8 text-sm text-gray-500 text-center">No notifications yet</p>
            } @else {
              @for (item of notificationService.notifications(); track item.id) {
                <button
                  type="button"
                  class="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  [class.bg-blue-50]="!item.isRead"
                  (click)="onNotificationClick(item, $event)"
                >
                  <div class="flex items-start gap-2">
                    @if (!item.isRead) {
                      <span class="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    } @else {
                      <span class="mt-1.5 w-2 h-2 shrink-0"></span>
                    }
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ item.message }}</p>
                      <p class="text-[11px] text-gray-400 mt-1">{{ formatTime(item.createdAt) }}</p>
                    </div>
                  </div>
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  @Input() role: UserRole = 'TRAVELER';

  notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);

  panelOpen = false;

  async ngOnInit(): Promise<void> {
    await this.notificationService.initialize();
  }

  async ngOnDestroy(): Promise<void> {
    await this.notificationService.disconnect();
  }

  @HostListener('document:click')
  closePanel(): void {
    this.panelOpen = false;
  }

  badgeLabel(): string {
    const count = this.notificationService.unreadCount();
    return count > 99 ? '99+' : String(count);
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }

  async markAllRead(event: Event): Promise<void> {
    event.stopPropagation();
    await this.notificationService.markAllAsRead();
  }

  async onNotificationClick(item: AppNotification, event: Event): Promise<void> {
    event.stopPropagation();
    if (!item.isRead) {
      await this.notificationService.markAsRead(item.id);
    }
    this.panelOpen = false;
    this.navigateForNotification(item);
  }

  formatTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private navigateForNotification(item: AppNotification): void {
    const itineraryId = item.itineraryId;
    if (!itineraryId) {
      return;
    }

    const role = this.authService.userRole() ?? this.role;
    const isConversation =
      item.type === 'CONVERSATION_MESSAGE' ||
      item.type === 'ITINERARY_RETURNED_FOR_CORRECTION';

    if (role === 'TRAVELER') {
      if (isConversation) {
        void this.router.navigate(['/guest/dashboard'], {
          queryParams: { openConversation: itineraryId },
        });
      } else if (item.type === 'ITINERARY_CREATED' || item.type === 'ITINERARY_SUBMITTED') {
        void this.router.navigate(['/guest/itinerary-builder', itineraryId]);
      } else {
        void this.router.navigate(['/guest/dashboard']);
      }
      return;
    }

    if (role === 'STAFF') {
      if (isConversation) {
        void this.router.navigate(['/agency/review'], {
          queryParams: { openConversation: itineraryId },
        });
      } else if (item.type === 'ITINERARY_PRICED') {
        void this.router.navigate(['/agency/pricing', itineraryId]);
      } else {
        void this.router.navigate(['/agency/review']);
      }
      return;
    }

    if (role === 'ADMIN') {
      void this.router.navigate(['/admin/itineraries']);
    }
  }
}
