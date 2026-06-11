import { Injectable, inject, signal, computed, effect, NgZone } from '@angular/core';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private auth = inject(AuthService);
  private zone = inject(NgZone);
  private db = getFirestore();
  private unsub: Unsubscribe | null = null;

  readonly notes = signal<Map<string, string>>(new Map());
  readonly count = computed(() => this.notes().size);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      this.cleanup();
      if (!user) {
        this.notes.set(new Map());
        return;
      }
      const colRef = collection(this.db, `users/${user.uid}/notes`);
      this.unsub = onSnapshot(colRef, (snapshot) => {
        this.zone.run(() => {
          const m = new Map<string, string>();
          for (const d of snapshot.docs) {
            m.set(d.id, (d.data()['text'] as string) ?? '');
          }
          this.notes.set(m);
        });
      });
    });
  }

  noteFor(cardId: string): string {
    return this.notes().get(cardId) ?? '';
  }

  hasNote(cardId: string): boolean {
    return this.notes().has(cardId);
  }

  save(cardId: string, text: string): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const trimmed = text.trim();
    if (!trimmed) {
      this.remove(cardId);
      return;
    }
    const ref = doc(this.db, `users/${user.uid}/notes`, cardId);
    setDoc(ref, { text: trimmed, updatedAt: serverTimestamp() }).catch(() => {});
  }

  remove(cardId: string): void {
    const user = this.auth.currentUser();
    if (!user) return;
    deleteDoc(doc(this.db, `users/${user.uid}/notes`, cardId)).catch(() => {});
  }

  private cleanup(): void {
    this.unsub?.();
    this.unsub = null;
  }
}
