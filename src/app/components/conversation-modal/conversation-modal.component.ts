import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DialogComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../ui/dialog.component';
import type { ItineraryConversation, ItineraryMessage } from '../../models/itinerary.models';
import { ItineraryChatService } from '../../services/itinerary-chat.service';
import { ItineraryService } from '../../services/itinerary.service';
import { ToastService } from '../../services/toast.service';

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
    <app-dialog [open]="open" (openChange)="onOpenChange($event)" size="lg">
      <app-dialog-header>
        <app-dialog-title>{{ title }}</app-dialog-title>
        <app-dialog-description>
          @if (canSendMessage) {
            Reply in the itinerary conversation thread
          } @else if (canViewConversation) {
            Read-only conversation history
          } @else {
            Conversation unavailable
          }
        </app-dialog-description>
      </app-dialog-header>

      @if (loading) {
        <div class="py-8 text-center text-gray-500 text-sm">Loading conversation...</div>
      } @else if (loadError) {
        <div class="py-8 text-center text-red-600 text-sm">{{ loadError }}</div>
      } @else {
        <div #scrollHost class="h-80 overflow-y-auto border rounded-md p-3 space-y-2 bg-gray-50">
          @if (messages.length === 0) {
            <p class="text-sm text-gray-500 text-center py-6">No messages yet.</p>
          }
          @for (msg of messages; track msg.id) {
            <div [class]="bubbleClass(msg)">
              <div class="text-[11px] opacity-70 mb-1">
                {{ msg.senderName || msg.senderRole }} · {{ msg.senderRole }} · {{ msg.createdAt | date:'short' }}
              </div>
              <div class="text-sm whitespace-pre-wrap">{{ msg.message }}</div>
            </div>
          }
        </div>

        @if (canSendMessage) {
          <div class="mt-3">
            <textarea
              class="w-full border rounded-md p-2 text-sm"
              rows="3"
              [(ngModel)]="draftMessage"
              placeholder="Type a message..."
              [disabled]="sending"
            ></textarea>
          </div>
        } @else if (canViewConversation) {
          <p class="mt-3 text-sm text-gray-500">
            {{ readOnlyHint || 'This conversation is read-only for your account.' }}
          </p>
        }
      }

      <app-dialog-footer>
        <button class="btn btn-outline" type="button" (click)="onOpenChange(false)">Close</button>
        @if (canSendMessage) {
          <button
            class="btn btn-primary"
            type="button"
            [disabled]="sending || !draftMessage.trim()"
            (click)="sendMessage()"
          >
            @if (sending) { Sending... } @else { Send }
          </button>
        }
      </app-dialog-footer>
    </app-dialog>
  `,
})
export class ConversationModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() itineraryId: number | null = null;
  @Input() title = 'Conversation';
  @Input() currentRole = 'TRAVELER';
  @Input() currentUserId: number | null = null;
  @Input() readOnlyHint = '';
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('scrollHost') scrollHost?: ElementRef<HTMLDivElement>;

  private chatService = inject(ItineraryChatService);
  private itineraryService = inject(ItineraryService);
  private toastService = inject(ToastService);

  messages: ItineraryMessage[] = [];
  loading = false;
  loadError = '';
  sending = false;
  draftMessage = '';
  canViewConversation = false;
  canSendMessage = false;
  assignedReviewerId: number | null = null;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['open']?.currentValue === true || (this.open && changes['itineraryId'])) {
      await this.loadConversation();
    }
    if (changes['open']?.currentValue === false) {
      await this.chatService.disconnect();
    }
  }

  ngOnDestroy(): void {
    void this.chatService.disconnect();
  }

  async onOpenChange(value: boolean): Promise<void> {
    if (!value) {
      await this.chatService.disconnect();
      this.loadError = '';
    }
    this.openChange.emit(value);
  }

  private async loadConversation(): Promise<void> {
    if (!this.open || !this.itineraryId) return;

    this.loading = true;
    this.loadError = '';
    try {
      const conversation: ItineraryConversation = await this.itineraryService.getConversation(this.itineraryId);
      this.canViewConversation = conversation.canViewConversation;
      this.canSendMessage = conversation.canSendMessage;
      this.assignedReviewerId = conversation.assignedReviewerId ?? null;
      this.messages = conversation.canViewConversation ? (conversation.messages ?? []) : [];

      if (!this.canViewConversation) {
        this.loadError = 'Conversation is not available for this itinerary.';
        return;
      }

      if (!this.readOnlyHint && this.currentRole !== 'TRAVELER' && !this.canSendMessage) {
        this.readOnlyHint = this.assignedReviewerId
          ? 'This itinerary is currently being reviewed by another staff member.'
          : 'This conversation is read-only for your account.';
      }

      await this.chatService.connect(this.itineraryId, (msg) => {
        if (msg.type === 'INTERNAL_NOTE') return;
        if (this.messages.some((m) => m.id === msg.id && msg.id > 0)) return;
        this.messages = [...this.messages, msg];
        this.scrollToBottom();
      });

      this.scrollToBottom();
    } catch (e) {
      console.error(e);
      this.loadError = this.itineraryService.readApiError(e);
    } finally {
      this.loading = false;
    }
  }

  bubbleClass(msg: ItineraryMessage): string {
    const mine =
      (msg.senderRole ?? '').toUpperCase() === (this.currentRole ?? '').toUpperCase() ||
      (this.currentUserId != null && msg.senderId === this.currentUserId);
    return mine
      ? 'ml-10 bg-green-100 border border-green-200 p-2 rounded-lg'
      : 'mr-10 bg-white border border-gray-200 p-2 rounded-lg';
  }

  async sendMessage(): Promise<void> {
    if (!this.itineraryId || !this.canSendMessage) return;
    const value = this.draftMessage.trim();
    if (!value) return;

    this.sending = true;
    try {
      const created = await this.itineraryService.addMessage(this.itineraryId, value, 'COMMENT');
      if (!this.messages.some((m) => m.id === created.id)) {
        this.messages = [...this.messages, created];
      }
      this.draftMessage = '';
      this.scrollToBottom();
    } catch (e) {
      console.error(e);
      this.toastService.error(this.itineraryService.readApiError(e));
    } finally {
      this.sending = false;
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.scrollHost?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }
}


