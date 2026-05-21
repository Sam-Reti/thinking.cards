import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  template: `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon-svg">
      @switch (key()) {
        @case ('socratic-sparks') {
          <!-- Question arc + spark lines -->
          <path d="M 17 17 C 17 11, 24 9, 28 12 C 32 15, 30 20, 24 22 L 24 26"
                stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="24" cy="33" r="2.5" fill="currentColor"/>
          <line x1="8" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
          <line x1="40" y1="10" x2="36" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
          <line x1="6" y1="26" x2="11" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
          <line x1="37" y1="26" x2="42" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
        }

        @case ('this-or-that') {
          <!-- Two overlapping circles -->
          <circle cx="18" cy="24" r="13" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <circle cx="30" cy="24" r="13" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.55"/>
        }

        @case ('moral-compass') {
          <!-- Compass: circle + needle -->
          <circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <polygon points="24,8 27.5,22 24,26 20.5,22" fill="currentColor"/>
          <polygon points="24,40 27.5,26 24,22 20.5,26" fill="currentColor" opacity="0.3"/>
          <circle cx="24" cy="24" r="2" fill="currentColor"/>
        }

        @case ('mind-bogglers') {
          <!-- Two offset interlocking squares -->
          <rect x="9" y="9" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <rect x="21" y="21" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5"/>
        }

        @case ('know-thyself') {
          <!-- Concentric circles — looking inward -->
          <circle cx="24" cy="24" r="17" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <circle cx="24" cy="24" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
          <circle cx="24" cy="24" r="3" fill="currentColor"/>
        }

        @case ('favorites') {
          <!-- Heart icon -->
          <path d="M24 39.7l-2.1-1.9C12.3 29.2 6 23.5 6 16.5 6 10.7 10.7 6 16.5 6c3.2 0 6.3 1.5 8.3 3.9L24 9l-.8-.9C25.2 7.5 28.3 6 31.5 6 37.3 6 42 10.7 42 16.5c0 7-6.3 12.7-15.9 21.3L24 39.7z"
                fill="currentColor"/>
        }

        @default {
          <circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2.5" fill="none"/>
          <circle cx="24" cy="24" r="3" fill="currentColor"/>
        }
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    .icon-svg { width: 100%; height: 100%; }
  `,
})
export class CategoryIconComponent {
  name = input('');

  key = computed(() =>
    this.name().toLowerCase().replace(/\s+/g, '-')
  );
}
