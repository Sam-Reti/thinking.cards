import { Component, inject, input, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Category } from '../../core/models/category.model';
import { Card } from '../../core/models/card.model';

@Component({
  selector: 'app-card-form',
  imports: [FormsModule],
  template: `
    <div class="form-card">
      <form (ngSubmit)="onSubmit()">
        <select [(ngModel)]="categoryId" name="categoryId" required (ngModelChange)="onCategoryChange($event)">
          <option value="" disabled>Select category</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.id">{{ cat.name }}</option>
          }
        </select>
        <input type="number" placeholder="Card Number (1-10)" [(ngModel)]="cardNumber" name="cardNumber" required min="1" />
        <textarea placeholder="Question text" [(ngModel)]="questionText" name="questionText" rows="3" required></textarea>
        @if (!isQuiz()) {
          <p class="hint">Line breaks = title + body | use • for bullets | Name: for quotes</p>
        }
        @if (isQuiz()) {
          <div class="quiz-fields">
            <p class="quiz-label">Answer Options</p>
            @for (opt of options; track $index) {
              <input [placeholder]="'Option ' + ($index + 1)" [(ngModel)]="options[$index]" [name]="'option' + $index" />
            }
            <div class="correct-row">
              <label>Correct Answer</label>
              <select [(ngModel)]="correctIndex" name="correctIndex">
                @for (opt of options; track $index) {
                  <option [ngValue]="$index">{{ opt || 'Option ' + ($index + 1) }}</option>
                }
              </select>
            </div>
            <textarea placeholder="Explanation (shown after answering)" [(ngModel)]="explanation" name="explanation" rows="3"></textarea>
          </div>
        }
        <button type="submit" class="btn-save">Add Card</button>
        @if (successMsg) {
          <p class="success">{{ successMsg }}</p>
        }
      </form>
    </div>
  `,
  styles: `
    .form-card {
      background: var(--bg-card);
      padding: 24px;
      border-radius: var(--radius);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input, select, textarea {
      background: var(--bg);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 12px 14px;
      color: var(--text);
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
      &::placeholder { color: var(--text-muted); }
    }
    select option { background: var(--bg); color: var(--text); }
    .btn-save {
      background: var(--accent);
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
    }
    .hint {
      color: var(--text-muted);
      font-size: 0.75rem;
      margin: -4px 0 0;
      opacity: 0.7;
    }
    .success {
      color: #00b894;
      font-size: 0.85rem;
      margin: 0;
    }
    .quiz-fields {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .quiz-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      margin: 0;
    }
    .correct-row {
      display: flex;
      align-items: center;
      gap: 10px;
      label {
        font-size: 0.85rem;
        color: var(--text-muted);
        white-space: nowrap;
      }
      select { flex: 1; }
    }
  `
})
export class CardFormComponent {
  private adminService = inject(AdminService);
  categories = input.required<Category[]>();
  cardCountMap = input<Record<string, number>>({});

  categoryId = '';
  cardNumber = 1;
  questionText = '';
  successMsg = '';

  options = ['', '', '', ''];
  correctIndex = 0;
  explanation = '';

  isQuiz = computed(() => {
    const cats = this.categories();
    const selected = cats.find(c => c.id === this.categoryId);
    return selected?.type === 'quiz';
  });

  onCategoryChange(categoryId: string) {
    const count = this.cardCountMap()[categoryId] || 0;
    this.cardNumber = count + 1;
  }

  onSubmit() {
    const card: Omit<Card, 'id'> = {
      categoryId: this.categoryId,
      cardNumber: Math.floor(Number(this.cardNumber)),
      questionText: this.questionText,
    };

    if (this.isQuiz()) {
      card.options = [...this.options];
      card.correctIndex = this.correctIndex;
      card.explanation = this.explanation;
    }

    this.adminService.addCard(card).subscribe(() => {
      this.successMsg = `Card #${this.cardNumber} added!`;
      this.questionText = '';
      this.cardNumber++;
      this.options = ['', '', '', ''];
      this.correctIndex = 0;
      this.explanation = '';
      setTimeout(() => (this.successMsg = ''), 3000);
    });
  }
}
