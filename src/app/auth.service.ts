import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);
  errorMessage = signal('');

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      this.errorMessage.set('');
    });
  }

  async signIn(email: string, password: string) {
    try {
      this.errorMessage.set('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/configuration-not-found') {
        this.errorMessage.set(
          'Firebase Auth is not configured for this project. Enable Email/Password sign-in in the Firebase console and verify authDomain.',
        );
      } else {
        this.errorMessage.set(error?.message || 'Unable to sign in.');
      }
      throw error;
    }
  }

  async signUp(email: string, password: string) {
    try {
      this.errorMessage.set('');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/configuration-not-found') {
        this.errorMessage.set(
          'Firebase Auth is not configured for this project. Enable Email/Password sign-in in the Firebase console and verify authDomain.',
        );
      } else {
        this.errorMessage.set(error?.message || 'Unable to create account.');
      }
      throw error;
    }
  }

  async signOut() {
    await signOut(auth);
  }
}
