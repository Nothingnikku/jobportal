import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Job, JobApplicationResponse } from '../../models/api.models';
import { ApiService } from '../../services/api.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  standalone: true,
  selector: 'app-applications',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
  })
export class ApplicationsComponent implements OnInit {
  output = '';
  errorMessage = '';
  lastResponse: JobApplicationResponse | null = null;
  jobs: Job[] = [];
  selectedJob: Job | null = null;
  freelancerId: number | null = null;
  appliedJobIds = new Set<number>();
  myApplications: JobApplicationResponse[] = [];

  readonly applicationForm = this.fb.nonNullable.group({
    coverLetter: ['', Validators.required],
    resumeFile: [null as File | null]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.resolveFreelancerId();
  }

  loadJobs(): void {
    this.api.getJobs().subscribe({
      next: (data) => {
        this.jobs = data.filter((job) => job.active);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not load jobs';
      }
    });
  }

  selectJob(job: Job): void {
    this.selectedJob = job;
    this.output = '';
    this.errorMessage = '';
  }

  resolveFreelancerId(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      return;
    }
    this.api.getFreelancers().subscribe({
      next: (data) => {
        const match = data.find((f) => f.email?.toLowerCase() === email.toLowerCase());
        this.freelancerId = match?.freelancerId ?? null;
        this.loadAppliedJobs();
        this.loadMyApplications();
      },
      error: () => {
        this.freelancerId = null;
      }
    });
  }

  apply(): void {
    if (this.applicationForm.invalid) {
      return;
    }
    if (!this.selectedJob) {
      this.errorMessage = 'Please select a job to apply.';
      return;
    }
    if (!this.freelancerId) {
      this.errorMessage = 'Freelancer profile not found.';
      return;
    }
    if (!this.applicationForm.getRawValue().resumeFile) {
      this.errorMessage = 'Please upload your resume (PDF/DOC).';
      return;
    }
    const payload = {
      jobId: this.selectedJob.jobId,
      freelancerId: this.freelancerId,
      coverLetter: this.applicationForm.getRawValue().coverLetter,
      resumeFile: this.applicationForm.getRawValue().resumeFile || undefined
    };
    this.api.applyJob(payload).subscribe({
      next: (data) => {
        this.appliedJobIds.add(this.selectedJob!.jobId);
        this.markApplied(this.selectedJob!.jobId);
        this.setResult(data);
        this.loadMyApplications();
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not apply')
    });
  }

  private loadAppliedJobs(): void {
    this.api.getAllJobApplications().subscribe({
      next: (apps) => {
        const ids = apps
          .filter((app) => app.freelancer?.freelancerId === this.freelancerId)
          .map((app) => app.job?.jobId)
          .filter((id): id is number => Number.isFinite(id));
        this.appliedJobIds = new Set(ids);
      },
      error: () => {
        this.appliedJobIds = new Set();
      }
    });
  }

  isApplied(jobId: number): boolean {
    return this.appliedJobIds.has(jobId);
  }

  private loadMyApplications(): void {
    this.api.getAllJobApplications().subscribe({
      next: (apps) => {
        this.myApplications = apps.filter((app) => app.freelancer?.freelancerId === this.freelancerId);
      },
      error: () => {
        this.myApplications = [];
      }
    });
  }

  private markApplied(jobId: number): void {
    try {
      const raw = localStorage.getItem('applied_jobs');
      const list = raw ? JSON.parse(raw) : [];
      const applied = Array.isArray(list) ? list : [];
      if (!applied.includes(jobId)) {
        applied.push(jobId);
      }
      localStorage.setItem('applied_jobs', JSON.stringify(applied));
    } catch {
      localStorage.setItem('applied_jobs', JSON.stringify([jobId]));
    }
  }

  private setResult(data: JobApplicationResponse): void {
    this.lastResponse = data;
    this.output = `Application saved successfully. ID: ${data.applicationId}`;
    this.errorMessage = '';
  }

  onResumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.applicationForm.patchValue({ resumeFile: file });
  }
}




