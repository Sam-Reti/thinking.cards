import { Injectable, signal } from '@angular/core';

export type Theme = 'midnight' | 'daylight' | 'ocean' | 'sunset' | 'forest' | 'lavender';

export interface ThemeMeta {
  name: Theme;
  label: string;
  bg: string;
  accent: string;
  type: 'dark' | 'light';
}

export const THEMES: ThemeMeta[] = [
  { name: 'midnight', label: 'Midnight', bg: '#1a1a2e', accent: '#e94560', type: 'dark' },
  { name: 'daylight', label: 'Daylight', bg: '#f5f5f7', accent: '#e94560', type: 'light' },
  { name: 'ocean', label: 'Ocean', bg: '#0a1628', accent: '#00b4d8', type: 'dark' },
  { name: 'sunset', label: 'Sunset', bg: '#1a1008', accent: '#ff8c42', type: 'dark' },
  { name: 'forest', label: 'Forest', bg: '#0a1a0f', accent: '#2ec46a', type: 'dark' },
  { name: 'lavender', label: 'Lavender', bg: '#f3eef8', accent: '#8b5cf6', type: 'light' },
];

export const DARK_THEMES = THEMES.filter(t => t.type === 'dark');
export const LIGHT_THEMES = THEMES.filter(t => t.type === 'light');

const STORAGE_KEY = 'theme';
const VALID_THEMES = new Set<string>(THEMES.map(t => t.name));

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.resolveInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private resolveInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'dark') return 'midnight';
    if (stored === 'light') return 'daylight';
    if (stored && VALID_THEMES.has(stored)) return stored as Theme;

    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'daylight' : 'midnight';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.dataset['theme'] = theme;
  }
}
