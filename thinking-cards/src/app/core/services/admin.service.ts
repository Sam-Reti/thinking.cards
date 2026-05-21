import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { from } from 'rxjs';
import { Category } from '../models/category.model';
import { Card } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private db = getFirestore();

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
}
