import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CardService } from '../../core/services/card.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProgressService } from '../../core/services/progress.service';
import { CategoryCardComponent } from '../../shared/components/category-card.component';
import { BrandLogoComponent } from '../../shared/components/brand-logo.component';
import { Card } from '../../core/models/card.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  imports: [CategoryCardComponent, BrandLogoComponent],
  template: `
    <div class="home container">
      <header class="hero">
        <app-brand-logo class="hero-logo" />
        <h1>Thinking Cards</h1>
        <p>50 thought-provoking questions across 5 categories. Pick a deck and start exploring.</p>
      </header>
      <div class="shuffle-wrap">
        <button class="shuffle-btn" (click)="openShuffle()">Shuffle All Decks</button>
      </div>

      @if (hasFavorites()) {
        <div class="grid" style="margin-bottom: 20px">
          <app-category-card
            [category]="favoritesTile"
            (click)="openFavorites()"
          />
        </div>
      }

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      <div class="grid">
        @for (cat of categories(); track cat.id) {
          <app-category-card
            [category]="cat"
            [progress]="progressFor(cat.id)"
            (click)="openCategory(cat)"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .home {
      padding-top: 32px;
      padding-bottom: 64px;
      position: relative;
      z-index: 1;
    }
    .home::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: -1;
      background: linear-gradient(135deg, #1a1a2e, #16213e, #1a1a3e, #0f3460);
      background-size: 400% 400%;
      animation: gradientShift 18s ease infinite;
    }
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .hero-logo {
      width: 64px;
      height: 64px;
      color: #e94560;
      margin: 0 auto 12px;
    }
    .hero {
      text-align: center;
      margin-bottom: 48px;
      h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 8px;
      }
      p {
        color: var(--text-muted);
        font-size: 1.05rem;
      }
    }
    .shuffle-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }
    .shuffle-btn {
      background: var(--accent);
      color: white;
      font-family: 'Poppins', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      padding: 14px 40px;
      border-radius: 50px;
      transition: transform 0.15s, opacity 0.2s;
      &:hover { opacity: 0.9; transform: scale(1.03); }
      &:active { transform: scale(0.97); }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
  `
})
export class HomeComponent {
  private cardService = inject(CardService);
  private favoritesService = inject(FavoritesService);
  private progressService = inject(ProgressService);
  private router = inject(Router);

  error = signal('');

  private allCards = toSignal(this.cardService.getAllCards(), {
    initialValue: [] as Card[],
  });

  private progressMap = computed(() =>
    this.progressService.countByCategory(this.allCards())
  );

  hasFavorites = computed(() => this.favoritesService.favoriteIds().size > 0);

  readonly favoritesTile: Category = {
    id: 'favorites',
    name: 'Favorites',
    icon: 'heart',
    color: '#e94560',
    description: 'Your saved cards',
    order: -1,
  };

  categories = toSignal(
    this.cardService.getCategories().pipe(
      catchError(err => {
        this.error.set(err.message || 'Failed to load categories');
        return of([] as Category[]);
      })
    ),
    { initialValue: [] as Category[] }
  );

  progressFor(categoryId: string): number {
    return this.progressMap().get(categoryId)?.percent ?? 0;
  }

  openCategory(cat: Category) {
    this.router.navigate(['/category', cat.id]);
  }

  openFavorites() {
    this.router.navigate(['/favorites']);
  }

  openShuffle() {
    this.router.navigate(['/shuffle']);
  }
}
