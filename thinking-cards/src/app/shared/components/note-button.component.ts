import { Component, inject, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NotesService } from '../../core/services/notes.service';
import { NoteEditorComponent } from './note-editor.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-note-button',
  imports: [NoteEditorComponent],
  template: `
    <button
      class="note-btn"
      [class.flat]="variant() === 'flat'"
      [class.has-note]="hasNote()"
      (click)="onOpen($event)"
      [attr.title]="hasNote() ? 'Edit note' : 'Add note'"
      [attr.aria-label]="hasNote() ? 'Edit note' : 'Add note'"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    </button>

    @if (editorOpen()) {
      <app-note-editor
        [cardId]="cardId()"
        [cardLabel]="cardLabel()"
        (close)="editorOpen.set(false)"
      />
    }
  `,
  styles: `
    :host { display: inline-flex; }
    .note-btn {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-surface);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 0.2s, color 0.2s, transform 0.2s;
      svg { width: 18px; height: 18px; }
      &:hover { background: var(--accent); color: white; }
    }
    .note-btn.flat {
      width: auto;
      height: auto;
      border-radius: 0;
      background: none;
      padding: 6px;
      svg { width: 20px; height: 20px; }
      &:hover { background: none; color: var(--text-muted); transform: scale(1.15); }
    }
    .note-btn.has-note::after {
      content: '';
      position: absolute;
      top: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }
    .note-btn.flat.has-note { color: var(--accent); }
  `,
})
export class NoteButtonComponent {
  private notesService = inject(NotesService);

  cardId = input.required<string>();
  cardLabel = input('');
  variant = input<'round' | 'flat'>('round');

  editorOpen = signal(false);
  hasNote = computed(() => this.notesService.notes().has(this.cardId()));

  onOpen(event: MouseEvent): void {
    event.stopPropagation();
    this.editorOpen.set(true);
  }
}
