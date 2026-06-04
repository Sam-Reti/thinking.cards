import { Injectable, inject, signal, effect, NgZone } from '@angular/core';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { AuthService } from './auth.service';

export interface QuizProgress {
  index: number;
  score: number;
  totalAnswered: number;
  completed?: boolean;
  totalCards?: number;
}

export interface MatrixProgress {
  index: number;
  gridStates: Record<number, Record<string, number>>;
  solvedPuzzles: number[];
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private auth = inject(AuthService);
  private zone = inject(NgZone);
  private db = getFirestore();
  private quizUnsub: Unsubscribe | null = null;
  private matrixUnsub: Unsubscribe | null = null;

  readonly allQuizProgress = signal<Map<string, QuizProgress>>(new Map());
  readonly allMatrixProgress = signal<Map<string, MatrixProgress>>(new Map());

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      this.cleanup();
      if (!user) {
        this.allQuizProgress.set(new Map());
        this.allMatrixProgress.set(new Map());
        return;
      }

      const quizCol = collection(this.db, `users/${user.uid}/quizState`);
      this.quizUnsub = onSnapshot(quizCol, (snap) => {
        this.zone.run(() => {
          const m = new Map<string, QuizProgress>();
          for (const d of snap.docs) m.set(d.id, d.data() as QuizProgress);
          this.allQuizProgress.set(m);
        });
      });

      const matrixCol = collection(this.db, `users/${user.uid}/matrixState`);
      this.matrixUnsub = onSnapshot(matrixCol, (snap) => {
        this.zone.run(() => {
          const m = new Map<string, MatrixProgress>();
          for (const d of snap.docs) m.set(d.id, d.data() as MatrixProgress);
          this.allMatrixProgress.set(m);
        });
      });
    });
  }

  // ── Card Position ──────────────────────────────────────────────────

  saveCardPosition(categoryId: string, index: number): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const ref = doc(this.db, `users/${user.uid}/cardState`, categoryId);
    setDoc(ref, { index, updatedAt: serverTimestamp() });
  }

  async loadCardPosition(categoryId: string): Promise<number> {
    const user = this.auth.currentUser();
    if (!user) return 0;
    const ref = doc(this.db, `users/${user.uid}/cardState`, categoryId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data()['index'] ?? 0) : 0;
  }

  // ── Quiz Progress ──────────────────────────────────────────────────

  saveQuizProgress(categoryId: string, data: QuizProgress): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const ref = doc(this.db, `users/${user.uid}/quizState`, categoryId);
    setDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  async loadQuizProgress(categoryId: string): Promise<QuizProgress | null> {
    const user = this.auth.currentUser();
    if (!user) return null;
    const ref = doc(this.db, `users/${user.uid}/quizState`, categoryId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as QuizProgress) : null;
  }

  // ── Matrix Progress ────────────────────────────────────────────────

  saveMatrixProgress(categoryId: string, data: MatrixProgress): void {
    const user = this.auth.currentUser();
    if (!user) return;
    const ref = doc(this.db, `users/${user.uid}/matrixState`, categoryId);
    setDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  async loadMatrixProgress(categoryId: string): Promise<MatrixProgress | null> {
    const user = this.auth.currentUser();
    if (!user) return null;
    const ref = doc(this.db, `users/${user.uid}/matrixState`, categoryId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as MatrixProgress) : null;
  }

  private cleanup(): void {
    this.quizUnsub?.();
    this.quizUnsub = null;
    this.matrixUnsub?.();
    this.matrixUnsub = null;
  }
}
