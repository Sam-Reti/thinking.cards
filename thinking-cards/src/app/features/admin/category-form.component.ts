import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule],
  template: `
    <div class="form-card">
      <h3>Add Category</h3>
      <form (ngSubmit)="onSubmit()">
        <input placeholder="Name" [(ngModel)]="name" name="name" required />
        <input placeholder="Description" [(ngModel)]="description" name="description" />
        <input placeholder="Icon (emoji)" [(ngModel)]="icon" name="icon" />
        <input placeholder="Color (#hex)" [(ngModel)]="color" name="color" />
        <input type="number" placeholder="Order" [(ngModel)]="order" name="order" />
        <button type="submit" class="btn-save">Save Category</button>
      </form>
    </div>
  `,
  styles: `
    .form-card {
      background: var(--bg-card);
      padding: 24px;
      border-radius: var(--radius);
    }
    h3 { margin-bottom: 12px; font-size: 1rem; }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input {
      background: var(--bg);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 12px 14px;
      color: var(--text);
      font-size: 0.9rem;
      &::placeholder { color: var(--text-muted); }
    }
    .btn-save {
      background: var(--accent);
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
    }
  `
})
export class CategoryFormComponent {
  private adminService = inject(AdminService);
  saved = output<void>();

  name = '';
  description = '';
  icon = '';
  color = '';
  order = 1;

  onSubmit() {
    this.adminService
      .addCategory({
        name: this.name,
        description: this.description,
        icon: this.icon,
        color: this.color,
        order: this.order,
      })
      .subscribe(() => {
        this.name = '';
        this.description = '';
        this.icon = '';
        this.color = '';
        this.order = 1;
        this.saved.emit();
      });
  }
}
