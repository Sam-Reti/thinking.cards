import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardService } from '../../core/services/card.service';
import { NotesService } from '../../core/services/notes.service';
import { CategoryIconComponent } from '../../shared/components/category-icon.component';
import { NoteEditorComponent } from '../../shared/components/note-editor.component';
import { Card } from '../../core/models/card.model';
import { Category } from '../../core/models/category.model';

interface NotebookEntry {
  card: Card;
  title: string;
  note: string;
}

interface NotebookGroup {
  category: Category;
  entries: NotebookEntry[];
  noteCount: number;
}

function cardTitle(text: string): string {
  const first = text.split('\n')[0].replace(/^#+\s*/, '').replace(/^"|"$/g, '').trim();
  return first.length > 64 ? `${first.slice(0, 64)}…` : first;
}

function notePreview(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > 90 ? `${flat.slice(0, 90)}…` : flat;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notebook',
  imports: [CategoryIconComponent, NoteEditorComponent],
  template: `
    <div class="notebook container">
      <button class="back-btn" (click)="goBack()">&larr; Back</button>

      <h2 class="page-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        Notebook
      </h2>
      <p class="subtitle">{{ notesService.count() }} {{ notesService.count() === 1 ? 'note' : 'notes' }}</p>

      <div class="filter-row">
        <button class="chip" [class.active]="filter() === 'all'" (click)="setFilter('all')">All cards</button>
        <button class="chip" [class.active]="filter() === 'notes'" (click)="setFilter('notes')">With notes</button>
      </div>

      @for (group of groups(); track group.category.id) {
        <section class="group">
          <button class="group-header" (click)="toggleGroup(group.category.id)">
            <app-category-icon [name]="group.category.name" class="group-icon" />
            <span class="group-name" [style.color]="group.category.color">{{ group.category.name }}</span>
            <span class="group-count">{{ group.noteCount }}/{{ group.entries.length }}</span>
            <span class="chevron" [class.open]="isExpanded(group.category.id)">&#9662;</span>
          </button>
          @if (isExpanded(group.category.id)) {
            <div class="entries">
              @for (entry of group.entries; track entry.card.id) {
                <button class="entry" (click)="openEditor(group, entry)">
                  <span class="entry-num">#{{ entry.card.cardNumber }}</span>
                  <span class="entry-body">
                    <span class="entry-title">{{ entry.title }}</span>
                    @if (entry.note) {
                      <span class="entry-note">{{ entry.note }}</span>
                    } @else {
                      <span class="entry-add">+ Add note</span>
                    }
                  </span>
                </button>
              }
            </div>
          }
        </section>
      } @empty {
        <p class="empty">
          @if (filter() === 'notes') {
            No notes yet — tap the pencil on any card, quiz, or puzzle to start writing.
          } @else {
            Loading cards...
          }
        </p>
      }

      @if (editing(); as e) {
        <app-note-editor [cardId]="e.card.id" [cardLabel]="e.label" (close)="editing.set(null)" />
      }
    </div>
  `,
  styles: `
    .notebook {
      padding-top: 24px;
      padding-bottom: 100px;
      display: flex;
      flex-direction: column;
      max-width: 560px;
    }
    .back-btn {
      align-self: flex-start;
      background: none;
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 16px;
      padding: 4px 0;
      &:hover { color: var(--text); }
    }
    .page-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.5rem;
      margin: 0 0 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      svg { width: 26px; height: 26px; color: var(--accent); }
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0 0 20px;
    }
    .filter-row {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .chip {
      padding: 8px 18px;
      border-radius: 999px;
      background: var(--bg-surface);
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s, color 0.2s;
      &.active { background: var(--accent); color: white; }
    }
    .group {
      margin-bottom: 10px;
    }
    .group-header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 12px;
      background: var(--bg-card);
      transition: background 0.2s;
      &:hover { background: var(--hover-overlay); }
    }
    .group-icon { width: 22px; height: 22px; flex-shrink: 0; }
    .group-name {
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      flex: 1;
      text-align: left;
    }
    .group-count {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }
    .chevron {
      color: var(--text-muted);
      font-size: 0.8rem;
      transition: transform 0.2s;
      &.open { transform: rotate(180deg); }
    }
    .entries {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0 4px;
    }
    .entry {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      text-align: left;
      padding: 10px 16px;
      border-radius: 10px;
      background: none;
      transition: background 0.15s;
      &:hover { background: var(--hover-overlay); }
    }
    .entry-num {
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      opacity: 0.6;
      min-width: 32px;
      padding-top: 2px;
    }
    .entry-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    .entry-title {
      font-size: 0.9rem;
      color: var(--text);
      line-height: 1.4;
    }
    .entry-note {
      font-size: 0.8rem;
      font-style: italic;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .entry-add {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--accent);
      opacity: 0.7;
    }
    .empty {
      color: var(--text-muted);
      font-size: 0.9rem;
      text-align: center;
      margin-top: 48px;
      line-height: 1.6;
    }
  `,
})
export class NotebookComponent {
  readonly notesService = inject(NotesService);
  private router = inject(Router);
  private cardService = inject(CardService);

  filter = signal<'all' | 'notes'>('all');
  expanded = signal<Set<string>>(new Set());
  editing = signal<{ card: Card; label: string } | null>(null);

  private categories = toSignal(this.cardService.getCategories(), {
    initialValue: [] as Category[],
  });

  private allCards = toSignal(this.cardService.getAllCards(), {
    initialValue: [] as Card[],
  });

  groups = computed<NotebookGroup[]>(() => {
    const notes = this.notesService.notes();
    const notesOnly = this.filter() === 'notes';

    const byCategory = new Map<string, Card[]>();
    for (const card of this.allCards()) {
      const list = byCategory.get(card.categoryId) ?? [];
      list.push(card);
      byCategory.set(card.categoryId, list);
    }

    const groups: NotebookGroup[] = [];
    for (const category of this.categories()) {
      const cards = (byCategory.get(category.id) ?? [])
        .sort((a, b) => a.cardNumber - b.cardNumber);

      const entries: NotebookEntry[] = [];
      let noteCount = 0;
      for (const card of cards) {
        const note = notes.get(card.id) ?? '';
        if (note) noteCount++;
        if (notesOnly && !note) continue;
        entries.push({ card, title: cardTitle(card.questionText), note: notePreview(note) });
      }

      if (!entries.length) continue;
      groups.push({ category, entries, noteCount });
    }
    return groups;
  });

  isExpanded(categoryId: string): boolean {
    return this.expanded().has(categoryId);
  }

  toggleGroup(categoryId: string): void {
    this.expanded.update(set => {
      const next = new Set(set);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  setFilter(filter: 'all' | 'notes'): void {
    this.filter.set(filter);
    if (filter === 'notes') {
      this.expanded.set(new Set(this.groups().map(g => g.category.id)));
    }
  }

  openEditor(group: NotebookGroup, entry: NotebookEntry): void {
    this.editing.set({
      card: entry.card,
      label: `#${entry.card.cardNumber} · ${group.category.name}`,
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
