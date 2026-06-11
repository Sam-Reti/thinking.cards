import {
  Component,
  inject,
  input,
  output,
  signal,
  computed,
  viewChild,
  afterNextRender,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NotesService } from '../../core/services/notes.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-note-editor',
  template: `
    <div class="note-backdrop" (click)="close.emit()">
      <div class="note-card" (click)="$event.stopPropagation()">
        <div class="note-header">
          <h3 class="note-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Note
          </h3>
          <button class="close-btn" (click)="close.emit()" aria-label="Close">&times;</button>
        </div>
        @if (cardLabel()) {
          <p class="note-context">{{ cardLabel() }}</p>
        }
        <textarea
          #noteInput
          class="note-input"
          placeholder="Write down your ideas or thoughts..."
          [value]="draft()"
          (input)="draft.set(noteInput.value)"
        ></textarea>
        <div class="note-actions">
          @if (hasExisting()) {
            <button class="delete-btn" (click)="onDelete()">Delete</button>
          }
          <span class="spacer"></span>
          <button class="save-btn" (click)="onSave()">Save</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .note-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fadeIn 0.2s ease-out;
    }
    .note-card {
      background: var(--bg-card);
      border-radius: 20px;
      padding: 24px;
      max-width: 440px;
      width: 100%;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.25s ease-out;
    }
    .note-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .note-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      svg { width: 18px; height: 18px; color: var(--accent); }
    }
    .close-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-surface);
      color: var(--text-muted);
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;
      &:hover { background: var(--accent); color: white; }
    }
    .note-context {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0 0 12px;
    }
    .note-input {
      user-select: text;
      -webkit-user-select: text;
      width: 100%;
      min-height: 160px;
      resize: vertical;
      border: none;
      border-radius: 12px;
      background: var(--bg-surface);
      color: var(--text);
      font-family: inherit;
      font-size: 0.95rem;
      line-height: 1.6;
      padding: 14px 16px;
      margin-bottom: 16px;
      outline: 2px solid transparent;
      transition: outline-color 0.15s;
      &:focus { outline-color: var(--accent); }
      &::placeholder { color: var(--text-muted); opacity: 0.6; }
    }
    .note-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .spacer { flex: 1; }
    .save-btn {
      background: var(--accent);
      color: white;
      padding: 10px 28px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: opacity 0.2s;
      &:hover { opacity: 0.9; }
    }
    .delete-btn {
      background: none;
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 10px 0;
      &:hover { color: #e17055; text-decoration: underline; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,
})
export class NoteEditorComponent {
  private notesService = inject(NotesService);

  cardId = input.required<string>();
  cardLabel = input('');
  close = output<void>();

  draft = signal('');
  hasExisting = computed(() => this.notesService.notes().has(this.cardId()));

  private noteInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('noteInput');

  constructor() {
    afterNextRender(() => {
      this.draft.set(this.notesService.noteFor(this.cardId()));
      this.noteInput().nativeElement.focus();
    });
  }

  onSave(): void {
    this.notesService.save(this.cardId(), this.draft());
    this.close.emit();
  }

  onDelete(): void {
    this.notesService.remove(this.cardId());
    this.close.emit();
  }
}
