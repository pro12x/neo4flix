import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info') {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type
    };
    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    setTimeout(() => this.remove(newToast.id), 5000); // Auto-dismiss after 5 seconds
  }

  remove(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }
}
