import { Injectable } from '@angular/core';
import { Auth, browserLocalPersistence, browserSessionPersistence } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  constructor(private auth: Auth) {}

  public setPersistence(rememberMe: boolean): Promise<void> {
    return this.auth.setPersistence(
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  }
}
