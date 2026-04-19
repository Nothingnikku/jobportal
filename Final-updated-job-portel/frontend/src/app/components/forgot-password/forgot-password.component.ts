import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {

  success = '';
  error = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly service:ApiService

  ) {}

  sendOtp(): void {
    const email = this.form.getRawValue().email;

    this.service.sendVerificationCode(email).subscribe({
      next: () => {
        this.success = 'OTP sent to your email';
        this.error = '';        
        this.router.navigate(['/reset-password'],{ queryParams: { email }} );
         
      },
      error: () => {
        this.error = 'Could not send OTP';
        this.success = '';
      }
    });
  }
}