import { Component, inject, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Category } from '../../core/models/category.model';

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
        <p class="hint">Line breaks = title + body | use • for bullets | Name: for quotes</p>
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

  onCategoryChange(categoryId: string) {
    const count = this.cardCountMap()[categoryId] || 0;
    this.cardNumber = count + 1;
  }

  onSubmit() {
    this.adminService
      .addCard({
        categoryId: this.categoryId,
        cardNumber: Math.floor(Number(this.cardNumber)),
        questionText: this.questionText,
      })
      .subscribe(() => {
        this.successMsg = `Card #${this.cardNumber} added!`;
        this.questionText = '';
        this.cardNumber++;
        setTimeout(() => (this.successMsg = ''), 3000);
      });
  }
}
