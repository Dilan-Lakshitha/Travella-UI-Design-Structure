import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private addToast(message: string, type: Toast['type'], duration = 4000): void {
    const id = this.generateId();
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(toasts => [...toasts, toast]);
    
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.addToast(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.addToast(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.addToast(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.addToast(message, 'warning', duration);
  }

  dismiss(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this.toasts.set([]);
  }
}
