import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BrandLogoComponent } from './brand-logo.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, BrandLogoComponent],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/" class="brand">
          <app-brand-logo class="brand-icon" />
          Thinking Cards
        </a>
        <div class="nav-actions">
          @if (auth.isLoggedIn()) {
            @if (auth.isAdmin()) {
              <a routerLink="/admin" class="nav-link">Admin</a>
            }
            <button class="btn-logout" (click)="onLogout()">Logout</button>
          } @else {
            <a routerLink="/login" class="nav-link">Login</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: `
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(26, 26, 46, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .navbar-inner {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 20px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      font-family: 'Poppins', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #eaeaea;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-icon {
      width: 28px;
      height: 28px;
      color: #e94560;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .nav-link {
      color: #a0a0b0;
      font-weight: 500;
      transition: color 0.2s;
      &:hover { color: #eaeaea; }
    }
    .btn-logout {
      background: rgba(233, 69, 96, 0.15);
      color: #e94560;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      transition: background 0.2s;
      &:hover { background: rgba(233, 69, 96, 0.25); }
    }
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/']));
  }
}
