import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { ApiService } from '../../services/api.service';
import { Job, JobApplicationResponse, FeedbackResponse } from '../../models/api.models';

@Component({
  standalone: true,
  selector: 'app-freelancer-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './freelancer-dashboard.component.html',
  styleUrls: ['./freelancer-dashboard.component.css'],
  })
export class FreelancerDashboardComponent implements OnInit {
  skillQuery = '';
  appliedCount = 0;
  savedCount = 0;
  jobs: Job[] = [];
  selectedJob: Job | null = null;
  displayName = 'Freelancer';
  appliedJobIds = new Set<number>();
  myApplications: JobApplicationResponse[] = [];
  feedbackList: FeedbackResponse[] = [];
  feedbackStatus = '';

  constructor(
    private readonly auth: AuthStateService,
    private readonly router: Router,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadAppliedJobsCount();
    this.loadSavedJobsCount();
    this.loadJobs();
    this.loadDisplayName();
    this.loadAppliedJobs();
    this.loadMyApplications();
    this.loadFeedback();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  searchJobs(): void {
    const key = this.skillQuery.trim();
    if (key) {
      localStorage.setItem('job_search', key);
    } else {
      localStorage.removeItem('job_search');
    }
    this.router.navigateByUrl('/jobs');
  }

  private loadAppliedJobsCount(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      this.appliedCount = 0;
      return;
    }
    this.api.getFreelancers().subscribe({
      next: (freelancers) => {
        const freelancer = freelancers.find((f) => f.email?.toLowerCase() === email.toLowerCase());
        const freelancerId = freelancer?.freelancerId;
        this.api.getAllJobApplications().subscribe({
          next: (apps: JobApplicationResponse[]) => {
            this.appliedCount = apps.filter((app) => {
              const appFreelancer = app.freelancer;
              if (freelancerId && appFreelancer?.freelancerId) {
                return appFreelancer.freelancerId === freelancerId;
              }
              return (appFreelancer?.email || '').toLowerCase() === email.toLowerCase();
            }).length;
          },
          error: () => {
            this.appliedCount = 0;
          }
        });
      },
      error: () => {
        this.appliedCount = 0;
      }
    });
  }

  private loadAppliedJobs(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      this.appliedJobIds = new Set();
      return;
    }
    this.api.getFreelancers().subscribe({
      next: (freelancers) => {
        const freelancer = freelancers.find((f) => f.email?.toLowerCase() === email.toLowerCase());
        const freelancerId = freelancer?.freelancerId;
        this.api.getAllJobApplications().subscribe({
          next: (apps) => {
            const ids = apps
              .filter((app) => {
                if (freelancerId && app.freelancer?.freelancerId) {
                  return app.freelancer.freelancerId === freelancerId;
                }
                return (app.freelancer?.email || '').toLowerCase() === email.toLowerCase();
              })
              .map((app) => app.job?.jobId)
              .filter((id): id is number => Number.isFinite(id));
            this.appliedJobIds = new Set(ids);
          },
          error: () => {
            this.appliedJobIds = new Set();
          }
        });
      },
      error: () => {
        this.appliedJobIds = new Set();
      }
    });
  }

  private loadMyApplications(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      this.myApplications = [];
      return;
    }
    this.api.getFreelancers().subscribe({
      next: (freelancers) => {
        const freelancer = freelancers.find((f) => f.email?.toLowerCase() === email.toLowerCase());
        const freelancerId = freelancer?.freelancerId;
        this.api.getAllJobApplications().subscribe({
          next: (apps) => {
            this.myApplications = apps.filter((app) => app.freelancer?.freelancerId === freelancerId);
          },
          error: () => {
            this.myApplications = [];
          }
        });
      },
      error: () => {
        this.myApplications = [];
      }
    });
  }

  loadFeedback(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      this.feedbackList = [];
      this.feedbackStatus = 'Not logged in.';
      return;
    }
    this.api.getFreelancers().subscribe({
      next: (freelancers) => {
        const freelancer = freelancers.find((f) => f.email?.toLowerCase() === email.toLowerCase());
        const freelancerId = freelancer?.freelancerId;
        if (!freelancerId) {
          this.feedbackList = [];
          this.feedbackStatus = 'Freelancer profile not found.';
          return;
        }
        this.api.getFeedbackForFreelancer(freelancerId).subscribe({
          next: (data) => {
            this.feedbackList = data || [];
            this.feedbackStatus = `Loaded ${this.feedbackList.length} feedback.`;
          },
          error: () => {
            this.feedbackList = [];
            this.feedbackStatus = 'Could not load feedback.';
          }
        });
      },
      error: () => {
        this.feedbackList = [];
        this.feedbackStatus = 'Could not load freelancer profile.';
      }
    });
  }

  private loadSavedJobsCount(): void {
    try {
      const raw = localStorage.getItem('saved_jobs');
      if (!raw) {
        this.savedCount = 0;
        return;
      }
      const parsed = JSON.parse(raw);
      this.savedCount = Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      this.savedCount = 0;
    }
  }

  isApplied(jobId: number): boolean {
    return this.appliedJobIds.has(jobId);
  }

  isSaved(jobId: number): boolean {
    const saved = this.getSavedJobs();
    return saved.some((job) => job.jobId === jobId);
  }

  toggleSave(job: Job): void {
    const saved = this.getSavedJobs();
    const index = saved.findIndex((item) => item.jobId === job.jobId);
    if (index >= 0) {
      saved.splice(index, 1);
    } else {
      saved.push(job);
    }
    localStorage.setItem('saved_jobs', JSON.stringify(saved));
    this.loadSavedJobsCount();
  }

  selectJob(job: Job): void {
    this.selectedJob = job;
  }

  private getSavedJobs(): Job[] {
    try {
      const raw = localStorage.getItem('saved_jobs');
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private loadJobs(): void {
    this.api.getJobs().subscribe({
      next: (data) => {
        this.jobs = data.filter((job) => job.active);
      },
      error: () => {
        this.jobs = [];
      }
    });
  }

  private loadDisplayName(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      this.displayName = 'Freelancer';
      return;
    }
    this.api.getFreelancers().subscribe({
      next: (freelancers) => {
        const match = freelancers.find((f) => f.email?.toLowerCase() === email.toLowerCase());
        this.displayName = match?.name || email.split('@')[0] || 'Freelancer';
      },
      error: () => {
        this.displayName = email.split('@')[0] || 'Freelancer';
      }
    });
  }
}



