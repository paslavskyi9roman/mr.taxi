import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc
} from '@angular/fire/firestore';
import { from, Observable, throwError } from 'rxjs';
import { Tariff } from './tariff.model';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  private firestore: Firestore = inject(Firestore);
  private tariffsCollection = collection(this.firestore, 'tariffs');

  public getTariffs(): Observable<Tariff[]> {
    return collectionData(this.tariffsCollection, { idField: 'id' }) as Observable<Tariff[]>;
  }

  public addTariff(tariff: Tariff): Observable<any> {
    return from(addDoc(this.tariffsCollection, tariff));
  }

  public updateTariff(tariff: Tariff): Observable<void> {
    if (!tariff.id) {
      return throwError(() => new Error('Document ID is required'));
    }

    const docRef = doc(this.firestore, 'tariffs', tariff.id);
    const tariffData = { ...tariff };
    delete tariffData.id;

    return from(updateDoc(docRef, tariffData));
  }

  public deleteTariff(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'tariffs', id);
    return from(deleteDoc(docRef));
  }
}
