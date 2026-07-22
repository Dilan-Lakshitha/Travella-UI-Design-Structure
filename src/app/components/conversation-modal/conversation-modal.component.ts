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
import type { ChatTypingUser, ItineraryConversation, ItineraryMessage } from '../../models/itinerary.models';
import { ItineraryChatService } from '../../services/itinerary-chat.service';
import { ItineraryService } from '../../services/itinerary.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '@app/services/auth.service';

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
  templateUrl: './conversation-modal.component.html',
  styleUrl: './conversation-modal.component.scss'
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
  private auth = inject(AuthService);
  private typingTimeout?: any;
  private isTypingSent = false;

  typingUsers: ChatTypingUser[] = [];
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
      await this.stopTyping();
      this.typingUsers = [];
      await this.chatService.disconnect();
      this.loadError = '';
    }
    this.openChange.emit(value);
  }

  onTyping() {
    if (!this.itineraryId || !this.currentUserId) return;

    if (!this.isTypingSent) {
      this.isTypingSent = true;
      void this.chatService.notifyTyping(
        this.itineraryId,
        this.currentUserId,
        this.currentRole
      );
    }

    clearTimeout(this.typingTimeout);
    // this.typingTimeout = setTimeout(() => {
    //   void this.stopTyping();
    // }, 1200);
  }

  async stopTyping() {
    if (!this.isTypingSent || !this.itineraryId || !this.currentUserId) return;
    
    this.isTypingSent = false;
    clearTimeout(this.typingTimeout);
    this.typingTimeout = undefined;
    
    await this.chatService.notifyStoppedTyping(
      this.itineraryId,
      this.currentUserId
    );
  }

  private async loadConversation(): Promise<void> {
    if (!this.open || !this.itineraryId) return;

    this.typingUsers = [];
    this.isTypingSent = false;
    clearTimeout(this.typingTimeout);
    this.typingTimeout = undefined;
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

      await this.chatService.connect(
        this.itineraryId,
        (msg) => {
          if (msg.type === 'INTERNAL_NOTE') return;
          if (this.messages.some((m) => m.id === msg.id && msg.id > 0)) return;
          this.messages = [...this.messages, msg];
          this.scrollToBottom();
        },
        (user) => {
          if (user.senderId === this.currentUserId) return;
          if (!this.typingUsers.some(x => x.senderId === user.senderId)) {
            this.typingUsers = [...this.typingUsers, user];
          }
        },
        (user) => {
          this.typingUsers = this.typingUsers.filter(x => x.senderId !== user.senderId);
        }
      );

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

    await this.stopTyping();

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


