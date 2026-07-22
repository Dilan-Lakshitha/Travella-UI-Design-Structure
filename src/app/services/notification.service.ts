import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthService } from './auth.service';
import type { AppNotification } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = `${API_BASE_URL}/api/notifications`;

  private connection: signalR.HubConnection | null = null;

  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal(0);

  async initialize(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    await Promise.all([this.refresh(), this.connectHub()]);
  }

  async refresh(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.notifications.set([]);
      this.unreadCount.set(0);
      return;
    }

    const [items, countRes] = await Promise.all([
      firstValueFrom(this.http.get<AppNotification[]>(this.apiUrl)),
      firstValueFrom(this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`)),
    ]);

    this.notifications.set(items ?? []);
    this.unreadCount.set(countRes?.count ?? 0);
  }

  async markAsRead(notificationId: number): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiUrl}/${notificationId}/read`, {}));
    this.notifications.update((items) =>
      items.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  }

  async markAllAsRead(): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiUrl}/read-all`, {}));
    this.notifications.update((items) => items.map((n) => ({ ...n, isRead: true })));
    this.unreadCount.set(0);
  }

  async disconnect(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      await this.connection.stop();
    } catch {
      // ignore
    } finally {
      this.connection = null;
    }
  }

  private async connectHub(): Promise<void> {
    const token = this.auth.getToken();
    if (!token) {
      return;
    }

    await this.disconnect();

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveNotification', (payload: AppNotification) => {
      if (!payload?.id) {
        return;
      }

      this.notifications.update((items) => {
        const exists = items.some((n) => n.id === payload.id);
        if (exists) {
          return items;
        }
        return [payload, ...items].slice(0, 50);
      });
    });

    this.connection.on('UnreadCountChanged', (count: number) => {
      if (typeof count === 'number') {
        this.unreadCount.set(count);
      }
    });

    await this.connection.start();
  }
}
