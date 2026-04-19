import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  })
export class LoginComponent {
  success = '';
  error = '';

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['ADMIN' as string, Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService,
    private readonly router: Router
  ) {}

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password, role } = this.loginForm.getRawValue();

    if (role === 'RECRUITER') {
      this.api.loginRecruiter({ email, password }).subscribe({
        next: () => {
          this.auth.loginRecruiter(email);
          this.success = 'Login successful';
          this.error = '';
          this.router.navigateByUrl('/recruiter-dashboard');
        },
        error: (err) => {
          this.error = this.getLoginError(err);
          this.success = '';
        }
      });
      return;
    }

    this.api.login({ email, password }).subscribe({
      next: (response) => {
        const session = this.auth.loginFromAuthResponse(email, response);
        if (session) {
          this.success = 'Login successful';
          this.error = '';
          if (session.role === 'ADMIN') {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl('/freelancer-dashboard');
          }
        } else {
          this.error = 'Login response received, but role could not be detected.';
          this.success = '';
        }
      },
      error: (err) => {
        this.error = this.getLoginError(err);
        this.success = '';
      }
    });
  }

  private getLoginError(err: any): string {
    if (err?.error instanceof ProgressEvent || err?.status === 0) {
      return 'Network error: backend is not reachable. Make sure Spring Boot is running on http://localhost:8081.';
    }
    const message = err?.error?.message || err?.error || 'Login failed';
    if (err?.status === 403 && typeof message === 'string' && message.toLowerCase().includes('not verified')) {
      return 'Your account is pending admin approval. Please try again after 24 hours.';
    }
    return message;
  }
}


