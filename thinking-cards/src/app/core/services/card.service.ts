import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Query,
} from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { Category } from '../models/category.model';
import { Card } from '../models/card.model';

function fromSnapshot<T>(q: Query): Observable<T[]> {
  return new Observable<T[]>(observer =>
    onSnapshot(
      q,
      snapshot => observer.next(
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[]
      ),
      err => observer.error(err)
    )
  );
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private db = getFirestore();

  getCategories(): Observable<Category[]> {
    return fromSnapshot<Category>(
      query(collection(this.db, 'categories'), orderBy('order'))
    );
  }

  getAllCards(): Observable<Card[]> {
    return fromSnapshot<Card>(query(collection(this.db, 'cards')));
  }

  getCardsByCategory(categoryId: string): Observable<Card[]> {
    return fromSnapshot<Card>(
      query(collection(this.db, 'cards'), where('categoryId', '==', categoryId))
    ).pipe(
      map(cards => cards.sort((a, b) => a.cardNumber - b.cardNumber))
    );
  }
}
