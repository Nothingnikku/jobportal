import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, SignupRequest } from '../models/api.models';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly state: AuthStateService
  ) {}

  signup(payload: SignupRequest): Observable<string> {
    return this.api.signup(payload);
  }

  login(payload: LoginRequest): Observable<string> {
    return this.api.login(payload);
  }

  logout(): void {
    this.state.logout();
  }
}
