import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  label: string;
  message: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(label: string, message: string, icon: string): void {
    const id = this.nextId++;
    this.toasts.update(t => [...t, { id, label, message, icon }]);
    setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: number): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
