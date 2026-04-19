import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Job, JobApplicationResponse, Recruiter, Skill } from '../../models/api.models';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-recruiter-dashboard',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css'],
  })
export class RecruiterDashboardComponent implements OnInit {
  jobs: Job[] = [];
  applications: JobApplicationResponse[] = [];
  skills: Skill[] = [];
  totalJobs = 0;
  totalApplications = 0;
  activeJobs = 0;
  recruiterId: number | null = null;
  recruiterName = 'Recruiter';
  feedbackNotes: Record<number, string> = {};
  feedbackStatus = '';
  editingJobId: number | null = null;
  editingActive = true;
  successMessage = '';
  errorMessage = '';

  readonly jobForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    skillsText: [''],
    location: ['', Validators.required],
    budget: [0, Validators.required],
    employmentType: ['FullTime', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.resolveRecruiter();
    this.api.getSkills().subscribe({
      next: (data) => (this.skills = data),
      error: () => (this.skills = [])
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  private resolveRecruiter(): void {
    const email = this.auth.currentSession?.email;
    if (!email) {
      return;
    }
    this.api.getRecruiters().subscribe({
      next: (data: Recruiter[]) => {
        const recruiter = data.find((r) => r.email?.toLowerCase() === email.toLowerCase());
        this.recruiterId = recruiter?.recruiterId ?? null;
        this.recruiterName = recruiter?.name || email.split('@')[0] || 'Recruiter';
        if (this.recruiterId) {
          this.loadJobs(this.recruiterId);
        }
      },
      error: () => {}
    });
  }

  private loadJobs(recruiterId: number): void {
    this.api.getJobsByRecruiter(recruiterId).subscribe({
      next: (data) => {
        this.jobs = data;
        this.totalJobs = data.length;
        this.activeJobs = data.filter((job) => job.active).length;
        this.loadApplications();
      },
      error: () => {
        this.jobs = [];
        this.totalJobs = 0;
        this.activeJobs = 0;
        this.applications = [];
        this.totalApplications = 0;
      }
    });
  }

  private loadApplications(): void {
    this.api.getAllJobApplications().subscribe({
      next: (data) => {
        const jobIds = new Set(this.jobs.map((job) => job.jobId));
        this.applications = data.filter((app) => app.job && jobIds.has(app.job.jobId));
        this.totalApplications = this.applications.length;
      },
      error: () => {
        this.applications = [];
        this.totalApplications = 0;
      }
    });
  }

  submitJob(): void {
    if (this.jobForm.invalid || !this.recruiterId) {
      return;
    }
    const raw = this.jobForm.getRawValue();
    if (this.editingJobId) {
      this.resolveSkillIds(raw.skillsText).subscribe({
        next: (skillIds) => {
          const payload = {
            title: raw.title,
            description: raw.description,
            location: raw.location,
            employmentType: raw.employmentType,
            budget: Number(raw.budget),
            active: this.editingActive,
            skillIds
          };
          this.api.updateJob(this.editingJobId as number, payload).subscribe({
            next: () => {
              this.successMessage = 'Job updated successfully.';
              this.errorMessage = '';
              this.cancelEdit();
              this.loadJobs(this.recruiterId as number);
            },
            error: (error) => {
              this.errorMessage = error?.error?.message || 'Could not update job';
              this.successMessage = '';
            }
          });
        },
        error: () => {
          this.errorMessage = 'Could not prepare skills';
          this.successMessage = '';
        }
      });
      return;
    }

    this.resolveSkillIds(raw.skillsText).subscribe({
      next: (skillIds) => {
            this.api
          .createJob({
            title: raw.title,
            description: raw.description,
            location: raw.location,
            employmentType: raw.employmentType,
            budget: Number(raw.budget),
            recruiterId: this.recruiterId as number,
            skillIds,
            active: true
          })
          .subscribe({
            next: () => {
              this.successMessage = 'Job posted successfully.';
              this.errorMessage = '';
              this.jobForm.reset({ employmentType: 'FullTime', budget: 0, skillsText: '' });
              this.loadJobs(this.recruiterId as number);
            },
            error: (error) => {
              this.errorMessage = error?.error?.message || 'Could not post job';
              this.successMessage = '';
            }
          });
      },
      error: () => {
        this.errorMessage = 'Could not prepare skills';
        this.successMessage = '';
      }
    });
  }

  startEdit(job: Job): void {
    this.editingJobId = job.jobId;
    this.editingActive = job.active;
    const skillNames = (job.skills || []).map((skill) => skill.name).filter((name) => name);
    this.jobForm.patchValue({
      title: job.title,
      description: job.description,
      skillsText: skillNames.join(', '),
      location: job.location,
      employmentType: job.employmentType || 'FullTime',
      budget: Number(job.budget || 0)
    });
  }

  cancelEdit(): void {
    this.editingJobId = null;
    this.editingActive = true;
    this.jobForm.reset({ employmentType: 'FullTime', budget: 0, skillsText: '' });
  }

  deleteJob(jobId: number): void {
    this.api.deleteJob(jobId).subscribe({
      next: () => {
        this.loadJobs(this.recruiterId as number);
      },
      error: () => {}
    });
  }

  setStatus(applicationId: number, status: string): void {
    this.api.updateApplicationStatus(applicationId, status).subscribe({
      next: (updated) => {
        const index = this.applications.findIndex((app) => app.applicationId === updated.applicationId);
        if (index >= 0) {
          this.applications[index] = updated;
        }
      },
      error: () => {}
    });
  }

  submitFeedback(app: JobApplicationResponse): void {
    if (!this.recruiterId || !app.freelancer?.freelancerId) {
      this.feedbackStatus = 'Recruiter or freelancer not found.';
      return;
    }
    const comment = (this.feedbackNotes[app.applicationId] || '').trim();
    if (!comment) {
      this.feedbackStatus = 'Please enter feedback before sending.';
      return;
    }
    this.api.addFeedback({
      recruiterId: this.recruiterId,
      freelancerId: app.freelancer.freelancerId,
      rating: 5,
      comment
    }).subscribe({
      next: () => {
        this.feedbackNotes[app.applicationId] = '';
        this.feedbackStatus = 'Feedback sent to freelancer.';
      },
      error: () => {
        this.feedbackStatus = 'Could not send feedback.';
      }
    });
  }

  formatSkills(skills?: Skill[]): string {
    if (!Array.isArray(skills) || !skills.length) {
      return '-';
    }
    return skills.map((skill) => skill.name).filter((name) => name).join(', ');
  }

  buildResumeUrl(link: string): string {
    if (!link) {
      return '';
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }
    if (link.startsWith('/')) {
      return `http://localhost:8081${link}`;
    }
    return `http://localhost:8081/${link}`;
  }

  private resolveSkillIds(text: string) {
    const names = text
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    if (!names.length) {
      return of<number[]>([]);
    }

    const existing = new Map(this.skills.map((skill) => [skill.name.toLowerCase(), skill.skillId]));
    const requests = names.map((name) => {
      const id = existing.get(name.toLowerCase());
      if (id) {
        return of(id);
      }
      return this.api.createSkill({ name }).pipe(
        map((created) => created.skillId),
        catchError(() => of(undefined))
      );
    });

    return forkJoin(requests).pipe(
      map((ids) => ids.filter((id): id is number => Number.isFinite(id)))
    );
  }
}



