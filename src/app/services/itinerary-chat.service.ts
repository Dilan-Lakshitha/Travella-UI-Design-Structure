import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../config/api.config';
import { AuthService } from './auth.service';
import type { ItineraryMessage } from '../models/itinerary.models';

@Injectable({ providedIn: 'root' })
export class ItineraryChatService {
  private auth = inject(AuthService);
  private connection: signalR.HubConnection | null = null;
  private activeItineraryId: number | null = null;

  async connect(itineraryId: number, onMessage: (msg: ItineraryMessage) => void): Promise<void> {
    await this.disconnect();

    const token = this.auth.getToken();
    if (!token) {
      return;
    }

    this.activeItineraryId = itineraryId;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/itinerary-chat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveMessage', (payload: ItineraryMessage) => {
      if (!payload?.message) return;
      onMessage({
        id: payload.id ?? 0,
        itineraryId: payload.itineraryId ?? itineraryId,
        senderId: payload.senderId,
        senderName: payload.senderName ?? '',
        senderRole: payload.senderRole,
        message: payload.message,
        type: payload.type ?? 'COMMENT',
        createdAt: payload.createdAt ?? new Date().toISOString(),
      });
    });

    await this.connection.start();
    await this.connection.invoke('JoinItineraryChat', itineraryId);
  }

  async disconnect(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      if (this.activeItineraryId != null && this.connection.state === signalR.HubConnectionState.Connected) {
        await this.connection.invoke('LeaveItineraryChat', this.activeItineraryId);
      }
      await this.connection.stop();
    } catch {
      // ignore teardown errors
    } finally {
      this.connection = null;
      this.activeItineraryId = null;
    }
  }
}
