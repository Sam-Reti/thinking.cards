import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { CardService } from '../../core/services/card.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProgressService } from '../../core/services/progress.service';
import { Card } from '../../core/models/card.model';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile container">
      <div class="avatar" [style.background]="avatarBg">
        {{ avatarLetter() }}
      </div>
      <p class="email">{{ userEmail() }}</p>

      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{{ cardsSeen() }}</span>
          <span class="stat-label">Cards Seen</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ favoritesCount() }}</span>
          <span class="stat-label">Favorites</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ decksExplored() }}</span>
          <span class="stat-label">Decks</span>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-header">
          <span>Overall Progress</span>
          <span class="progress-pct">{{ overallPercent() }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="overallPercent()"></div>
        </div>
      </div>

      @if (auth.isAdmin()) {
        <button class="action-btn admin-btn" (click)="goAdmin()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4"/>
          </svg>
          Admin Dashboard
        </button>
      }

      <button class="action-btn logout-btn" (click)="onLogout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>

      <p class="version">Thinking Cards v1.0</p>
    </div>
  `,
  styles: `
    :host { display: block; }

    .profile {
      padding-top: 48px;
      padding-bottom: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .email {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 36px;
    }

    .stats-row {
      display: flex;
      gap: 32px;
      margin-bottom: 36px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stat-value {
      font-family: 'Poppins', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .progress-section {
      width: 100%;
      max-width: 320px;
      margin-bottom: 40px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .progress-pct {
      font-weight: 600;
      color: #e94560;
    }

    .progress-track {
      height: 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #e94560, #ff6b6b);
      transition: width 0.4s ease;
    }

    .action-btn {
      width: 100%;
      max-width: 320px;
      padding: 14px 20px;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background 0.2s, opacity 0.2s;
      margin-bottom: 12px;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .admin-btn {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text);

      &:hover { background: rgba(255, 255, 255, 0.1); }
    }

    .logout-btn {
      background: rgba(233, 69, 96, 0.12);
      color: #e94560;

      &:hover { background: rgba(233, 69, 96, 0.2); }
    }

    .version {
      margin-top: 32px;
      font-size: 0.75rem;
      color: rgba(160, 160, 176, 0.4);
    }
  `,
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  private router = inject(Router);
  private cardService = inject(CardService);
  private favoritesService = inject(FavoritesService);
  private progressService = inject(ProgressService);

  private allCards = toSignal(this.cardService.getAllCards(), {
    initialValue: [] as Card[],
  });

  readonly avatarBg = '#e94560';

  avatarLetter = computed(() => {
    const email = this.auth.currentUser()?.email;
    return email ? email[0] : '?';
  });

  userEmail = computed(() => this.auth.currentUser()?.email ?? '');

  cardsSeen = computed(() => this.progressService.seenIds().size);

  favoritesCount = computed(() => this.favoritesService.favoriteIds().size);

  decksExplored = computed(() => {
    const seen = this.progressService.seenIds();
    const cards = this.allCards();
    const exploredCats = new Set<string>();
    for (const card of cards) {
      if (seen.has(card.id)) exploredCats.add(card.categoryId);
    }
    return exploredCats.size;
  });

  overallPercent = computed(() => {
    const total = this.allCards().length;
    if (total === 0) return 0;
    const seen = this.progressService.seenIds().size;
    return Math.round((seen / total) * 100);
  });

  goAdmin() {
    this.router.navigate(['/admin']);
  }

  onLogout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
