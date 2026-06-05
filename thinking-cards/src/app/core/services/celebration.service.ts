import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CelebrationService {
  readonly active = signal(false);

  trigger(): void {
    this.active.set(true);
    setTimeout(() => this.active.set(false), 2500);
  }
}
