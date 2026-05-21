import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

interface Tab {
  label: string;
  route: string;
}

const TABS: Tab[] = [
  { label: 'Categories', route: '/' },
  { label: 'Favorites', route: '/favorites' },
  { label: 'Shuffle', route: '/shuffle' },
  { label: 'Profile', route: '/profile' },
];

@Component({
  selector: 'app-bottom-bar',
  imports: [RouterLink],
  template: `
    <nav class="bottom-bar">
      @for (tab of tabs; track tab.route) {
        <a
          [routerLink]="tab.route"
          class="tab"
          [class.active]="activeRoute() === tab.route"
        >
          <span class="tab-icon">
            @switch (tab.route) {
              @case ('/') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              }
              @case ('/favorites') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              }
              @case ('/shuffle') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
                  <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
                  <line x1="4" y1="4" x2="9" y2="9"/>
                </svg>
              }
              @case ('/profile') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
            }
          </span>
          <span class="tab-label">{{ tab.label }}</span>
          @if (activeRoute() === tab.route) {
            <span class="dot"></span>
          }
        </a>
      }
    </nav>
  `,
  styles: `
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: 64px;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      background: var(--bar-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--bar-border);
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 16px;
      color: rgba(160, 160, 176, 0.7);
      text-decoration: none;
      transition: color 0.2s;
      position: relative;

      &.active {
        color: #e94560;
      }
    }

    .tab-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .tab-label {
      font-family: 'Poppins', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #e94560;
      position: absolute;
      bottom: 4px;
    }
  `,
})
export class BottomBarComponent {
  readonly tabs = TABS;

  private router = inject(Router);

  activeRoute = signal(this.matchTab(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.activeRoute.set(this.matchTab(e.urlAfterRedirects)));
  }

  private matchTab(url: string): string {
    // Exact match for defined tab routes
    const match = TABS.find((t) => t.route === url);
    if (match) return match.route;
    // Default to categories for home
    if (url === '' || url === '/') return '/';
    return url;
  }
}
