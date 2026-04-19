import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { EmailJsService } from '../../services/emailjs.service';


@Component({
  standalone: true,
  selector: 'app-signup-recruiter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-recruiter.component.html',
  styleUrls: ['./signup-recruiter.component.css'],
  })
export class SignupRecruiterComponent implements OnInit {
  verified = false;
  success = '';
  error = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    company: ['', Validators.required],
    code: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly emailjs: EmailJsService
  ) {}

  ngOnInit(): void {}

  sendCode(): void {
    const email = this.form.getRawValue().email;
    this.api.sendVerificationCode(email).subscribe({
      next: async (resp) => {
        const code = resp.replace('CODE:', '').trim();
        // try {
        //   const status = await this.emailjs.sendVerification(email, code);
        //   this.success = `Verification code sent to email. (${status})`;
        //   this.error = '';
        // } catch (err: any) {
        //   this.error = err?.message || 'EmailJS send failed';
        //   this.success = '';
        // }
      },
      error: () => {
        this.error = 'Could not send verification code';
        this.success = '';
      }
    });
  }

  verifyCode(): void {
    const { email, code } = this.form.getRawValue();
    this.api.verifyCode(email, code).subscribe({
      next: (resp) => {
        this.verified = resp === 'VERIFIED';
        this.success = this.verified ? 'Email verified.' : '';
        this.error = this.verified ? '' : 'Invalid code';
      },
      error: () => {
        this.error = 'Invalid code';
        this.success = '';
      }
    });
  }

  submit(): void {
    if (this.form.invalid || !this.verified) {
      return;
    }
    const raw = this.form.getRawValue();
    this.api.signup({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      phone: '9876543210',
      role: 'RECRUITER',
      company: raw.company
    } as any).subscribe({
      next: () => {
        this.success = 'Signup request sent to admin.';
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error || 'Signup failed';
        this.success = '';
      }
    });
  }
}


