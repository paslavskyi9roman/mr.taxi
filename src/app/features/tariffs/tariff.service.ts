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
  private listOfCities: Set<string> = new Set();

  public getTariffs(): Observable<Tariff[]> {
    return collectionData(this.tariffsCollection, {
      idField: 'id'
    }) as Observable<Tariff[]>;
  }

  public addTariff(tariff: Tariff): Observable<any> {
    return from(addDoc(this.tariffsCollection, tariff));
  }

  public updateTariff(tariff: Tariff): Observable<void> {
    if (!tariff.id) {
      return throwError(() => new Error('Document ID is required'));
    }

    const docRef = doc(this.firestore, 'tariffs', tariff.id);
    const { id, ...tariffData } = tariff;

    return from(updateDoc(docRef, tariffData));
  }

  public deleteTariff(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'tariffs', id);
    return from(deleteDoc(docRef));
  }
  public getCities(): Observable<string[]> {
    return new Observable((observer) => {
      this.getTariffs().subscribe((tariffs) => {
        this.listOfCities.clear();
        tariffs.forEach((tariff) => {
          this.listOfCities.add(tariff.route.from);
          this.listOfCities.add(tariff.route.to);
          tariff.additionalStops.forEach((stop) => {
            this.listOfCities.add(stop.from);
            this.listOfCities.add(stop.to);
          });
        });
        observer.next();
        observer.complete();
      });
    });
  }
}
