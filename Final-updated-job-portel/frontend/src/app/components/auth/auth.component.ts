import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  })
export class AuthComponent {
  mode: 'login' | 'signup' = 'login';

  readonly signupForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    role: ['FREELANCER' as const, Validators.required],
    company: [''],
    profileTitle: [''],
    experience: [''],
    hourlyRate: [0],
    location: ['']
  });

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  successMessage = '';
  errorMessage = '';
  loginSuccess = '';
  loginError = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService,
    private readonly router: Router
  ) {}

  get roleValue(): string {
    return this.signupForm.get('role')?.value ?? '';
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }
    this.api.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Signup submitted successfully.';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error || 'Signup failed';
        this.successMessage = '';
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const payload = this.loginForm.getRawValue();
    this.api.login(payload).subscribe({
      next: (response) => {
        const session = this.auth.loginFromAuthResponse(payload.email, response);
        if (session) {
          this.loginSuccess = 'Login successful.';
          this.loginError = '';
          if (session.role === 'ADMIN') {
            this.router.navigateByUrl('/admin');
          } else if (session.role === 'RECRUITER') {
            this.router.navigateByUrl('/recruiter-dashboard');
          } else {
            this.router.navigateByUrl('/freelancer-dashboard');
          }
        } else {
          this.loginError = 'Login response received, but role could not be detected.';
        }
      },
      error: (error) => {
        this.loginError = error?.error || 'Login failed';
        this.loginSuccess = '';
      }
    });
  }
}




