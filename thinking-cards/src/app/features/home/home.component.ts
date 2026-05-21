import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CardService } from '../../core/services/card.service';
import { ProgressService } from '../../core/services/progress.service';
import { CategoryCardComponent } from '../../shared/components/category-card.component';
import { Card } from '../../core/models/card.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  imports: [CategoryCardComponent],
  template: `
    <div class="home container">
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
      background: linear-gradient(135deg, var(--bg), var(--bg-card), var(--bg), var(--bg-surface));
      background-size: 400% 400%;
      animation: gradientShift 18s ease infinite;
    }
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
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
  private progressService = inject(ProgressService);
  private router = inject(Router);

  error = signal('');

  private allCards = toSignal(this.cardService.getAllCards(), {
    initialValue: [] as Card[],
  });

  private progressMap = computed(() =>
    this.progressService.countByCategory(this.allCards())
  );

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
}
