import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardService } from '../../core/services/card.service';
import { AdminService } from '../../core/services/admin.service';
import { CategoryFormComponent } from './category-form.component';
import { CardFormComponent } from './card-form.component';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, CategoryFormComponent, CardFormComponent],
  template: `
    <div class="admin container">
      <h1>Admin Dashboard</h1>

      <section class="section">
        <h2>Categories</h2>
        <div class="list">
          @for (cat of categories(); track cat.id) {
            <div class="item" [style.border-left-color]="cat.color">
              <span>{{ cat.icon }} {{ cat.name }} (order: {{ cat.order }})</span>
              <button class="del" (click)="deleteCategory(cat.id)">Delete</button>
            </div>
          }
        </div>
        <app-category-form (saved)="refresh()" />
      </section>

      <section class="section">
        <h2>Add Card</h2>
        <app-card-form [categories]="categories()" />
      </section>
    </div>
  `,
  styles: `
    .admin {
      padding-top: 24px;
      padding-bottom: 64px;
    }
    h1 { margin-bottom: 32px; }
    .section {
      margin-bottom: 40px;
    }
    h2 { margin-bottom: 16px; font-size: 1.2rem; }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card);
      padding: 12px 16px;
      border-radius: 10px;
      border-left: 4px solid;
    }
    .del {
      background: rgba(233,69,96,0.15);
      color: #e94560;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
    }
  `
})
export class AdminDashboardComponent {
  private cardService = inject(CardService);
  private adminService = inject(AdminService);

  categories = toSignal(this.cardService.getCategories(), {
    initialValue: [] as Category[],
  });

  deleteCategory(id: string) {
    this.adminService.deleteCategory(id).subscribe();
  }

  refresh() {
    // Firestore real-time updates handle this automatically
  }
}
