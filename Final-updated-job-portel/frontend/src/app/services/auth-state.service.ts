import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'ADMIN' | 'RECRUITER' | 'FREELANCER';

export interface UserSession {
  role: UserRole;
  email: string;
  source: 'auth' | 'recruiter';
}

const STORAGE_KEY = 'skillbridge_session';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly sessionSubject = new BehaviorSubject<UserSession | null>(this.loadFromStorage());
  readonly session$ = this.sessionSubject.asObservable();

  get currentSession(): UserSession | null {
    return this.sessionSubject.value;
  }

  loginFromAuthResponse(email: string, responseText: string): UserSession | null {
    const upper = responseText.toUpperCase();
    if (upper.includes('ROLE: ADMIN')) {
      return this.setSession({ email, role: 'ADMIN', source: 'auth' });
    }
    if (upper.includes('ROLE: RECRUITER')) {
      return this.setSession({ email, role: 'RECRUITER', source: 'auth' });
    }
    if (upper.includes('ROLE: FREELANCER')) {
      return this.setSession({ email, role: 'FREELANCER', source: 'auth' });
    }
    return null;
  }

  loginRecruiter(email: string): UserSession {
    return this.setSession({ email, role: 'RECRUITER', source: 'recruiter' });
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSubject.next(null);
  }

  private setSession(session: UserSession): UserSession {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
    return session;
  }

  private loadFromStorage(): UserSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  }
}
