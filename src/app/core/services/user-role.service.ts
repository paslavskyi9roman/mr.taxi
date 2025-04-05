import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '../models/user.enum';

interface UserData {
  role: UserRole;
  name?: string;
  email?: string;
  phoneNumber?: string;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private userRoleSubject = new BehaviorSubject<UserRole | null>(null);
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private firestore: Firestore) {}

  public async setUserRole(uid: string, role: UserRole = UserRole.User): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, { role }, { merge: true });
    this.userRoleSubject.next(role);
  }

  public async setUserData(uid: string, userData: UserData): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, userData, { merge: true });
    this.userRoleSubject.next(userData.role);
  }

  public async getUserRole(uid: string): Promise<UserRole | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const role = docSnapshot.data()['role'] as UserRole;
      this.userRoleSubject.next(role);
      return role;
    }

    this.userRoleSubject.next(null);
    return null;
  }

  public clearUserRole(): void {
    this.userRoleSubject.next(null);
  }
}
