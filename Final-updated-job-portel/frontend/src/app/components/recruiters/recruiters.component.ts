import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Job, Recruiter } from '../../models/api.models';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  standalone: true,
  selector: 'app-recruiters',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recruiters.component.html',
  styleUrls: ['./recruiters.component.css'],
  })
export class RecruitersComponent implements OnInit {
  recruiters: Recruiter[] = [];
  recruiterJobs: Job[] = [];
  selectedRecruiterId = 0;
  errorMessage = '';
  successMessage = '';
  loginError = '';

  readonly registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    company: ['', Validators.required]
  });

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecruiters();
  }

  loadRecruiters(): void {
    this.api.getRecruiters().subscribe({
      next: (data) => {
        this.recruiters = data;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not load recruiters';
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.api.registerRecruiter(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.registerForm.patchValue({ name: '', email: '', password: '', company: '' });
        this.loadRecruiters();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not register recruiter';
      }
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.api.loginRecruiter(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Recruiter login successful.';
        this.loginError = '';
        this.auth.loginRecruiter(this.loginForm.getRawValue().email);
        this.router.navigateByUrl('/recruiter-dashboard');
      },
      error: (error) => {
        this.loginError = error?.error?.message || 'Could not login recruiter';
        this.successMessage = '';
      }
    });
  }

  loadRecruiterJobs(): void {
    if (!this.selectedRecruiterId) {
      return;
    }
    this.api.getJobsByRecruiter(this.selectedRecruiterId).subscribe({
      next: (jobs) => {
        this.recruiterJobs = jobs;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not load recruiter jobs';
      }
    });
  }
}




