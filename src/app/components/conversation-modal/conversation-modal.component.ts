import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogComponent, DialogDescriptionComponent, DialogFooterComponent, DialogHeaderComponent, DialogTitleComponent } from '../ui/dialog.component';
import type { ItineraryMessage } from '../../models/itinerary.models';

@Component({
  selector: 'app-conversation-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
  ],
  template: `
    <app-dialog [open]="open" (openChange)="openChange.emit($event)" size="lg">
      <app-dialog-header>
        <app-dialog-title>{{ title }}</app-dialog-title>
        <app-dialog-description>Conversation history</app-dialog-description>
      </app-dialog-header>

      <div class="h-80 overflow-y-auto border rounded-md p-3 space-y-2 bg-gray-50">
        @for (msg of messages; track msg.id) {
          <div [class]="bubbleClass(msg)">
            <div class="text-[11px] opacity-70 mb-1">{{ msg.senderRole }} · {{ msg.createdAt | date:'short' }}</div>
            <div class="text-sm">{{ msg.message }}</div>
          </div>
        }
      </div>

      <div class="mt-3">
        <textarea
          class="w-full border rounded-md p-2 text-sm"
          rows="3"
          [(ngModel)]="draftMessage"
          placeholder="Type a message..."
        ></textarea>
      </div>

      <app-dialog-footer>
        <button class="btn btn-outline" type="button" (click)="openChange.emit(false)">Close</button>
        <button class="btn btn-primary" type="button" (click)="sendMessage()">Send</button>
      </app-dialog-footer>
    </app-dialog>
  `,
})
export class ConversationModalComponent {
  @Input() open = false;
  @Input() title = 'Conversation';
  @Input() currentRole = 'TRAVELER';
  @Input() messages: ItineraryMessage[] = [];
  @Output() openChange = new EventEmitter<boolean>();
  @Output() send = new EventEmitter<string>();

  draftMessage = '';

  bubbleClass(msg: ItineraryMessage): string {
    const mine = (msg.senderRole ?? '').toUpperCase() === (this.currentRole ?? '').toUpperCase();
    return mine
      ? 'ml-10 bg-green-100 border border-green-200 p-2 rounded-lg'
      : 'mr-10 bg-white border border-gray-200 p-2 rounded-lg';
  }

  sendMessage(): void {
    const value = this.draftMessage.trim();
    if (!value) return;
    this.send.emit(value);
    this.draftMessage = '';
  }
}

