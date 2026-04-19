import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {

  success = '';
  error = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', Validators.required],                  // ✅ OTP
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.form.patchValue({ email });
    }
  }

  reset(): void {
    if (this.form.invalid) {
      this.error = 'Please fill all fields correctly';
      this.success = '';
      return;
    }

    const { email, code, newPassword } = this.form.getRawValue();

    this.api.resetPassword(email, code, newPassword).subscribe({
      next: (resp) => {
        this.success = resp;
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error || 'Reset failed';
        this.success = '';
      }
    });
  }
}