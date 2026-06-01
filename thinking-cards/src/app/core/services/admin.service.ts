import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { from, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Card } from '../models/card.model';
import { AppUser } from '../models/app-user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private db = getFirestore();
  private functions = getFunctions();

  addCategory(category: Omit<Category, 'id'>) {
    return from(addDoc(collection(this.db, 'categories'), category));
  }

  updateCategory(id: string, data: Partial<Omit<Category, 'id'>>) {
    return from(updateDoc(doc(this.db, 'categories', id), data));
  }

  deleteCategory(id: string) {
    return from(deleteDoc(doc(this.db, 'categories', id)));
  }

  addCard(card: Omit<Card, 'id'>) {
    return from(addDoc(collection(this.db, 'cards'), card));
  }

  updateCard(id: string, data: Partial<Omit<Card, 'id'>>) {
    return from(updateDoc(doc(this.db, 'cards', id), data));
  }

  deleteCard(id: string) {
    return from(deleteDoc(doc(this.db, 'cards', id)));
  }

  getUsers(): Observable<AppUser[]> {
    const q = query(collection(this.db, 'users'), orderBy('createdAt', 'desc'));
    return new Observable<AppUser[]>((subscriber) => {
      const unsubscribe = onSnapshot(q, (snap) => {
        const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as AppUser);
        subscriber.next(users);
      });
      return unsubscribe;
    });
  }

  deleteUser(uid: string) {
    const fn = httpsCallable(this.functions, 'deleteUser');
    return from(fn({ uid }));
  }
}
