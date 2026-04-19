import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Freelancer, Job } from '../../models/api.models';

@Component({
  standalone: true,
  selector: 'app-freelancers',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './freelancers.component.html',
  styleUrls: ['./freelancers.component.css'],
  })
export class FreelancersComponent implements OnInit {
  freelancers: Freelancer[] = [];
  matchedJobs: Job[] = [];
  matchFreelancerId = 0;
  errorMessage = '';

  readonly freelancerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profileTitle: ['', Validators.required],
    experience: ['', Validators.required],
    hourlyRate: [0, Validators.required],
    location: ['', Validators.required],
    available: [true]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadFreelancers();
  }

  loadFreelancers(): void {
    this.api.getFreelancers().subscribe({
      next: (data) => {
        this.freelancers = data;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not load freelancers';
      }
    });
  }

  createFreelancer(): void {
    if (this.freelancerForm.invalid) {
      return;
    }

    this.api.createFreelancer(this.freelancerForm.getRawValue()).subscribe({
      next: () => {
        this.freelancerForm.patchValue({
          name: '',
          email: '',
          password: '',
          profileTitle: '',
          experience: '',
          hourlyRate: 0,
          location: '',
          available: true
        });
        this.loadFreelancers();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not create freelancer';
      }
    });
  }

  loadMatchedJobs(): void {
    if (!this.matchFreelancerId) {
      return;
    }
    this.api.getJobsForFreelancer(this.matchFreelancerId).subscribe({
      next: (data) => {
        this.matchedJobs = data;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not load matched jobs';
      }
    });
  }
}




