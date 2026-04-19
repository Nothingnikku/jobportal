import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Job, Skill } from '../../models/api.models';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-jobs',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  })
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  skills: Skill[] = [];
  errorMessage = '';
  searchTerm = '';
  searched = false;
  appliedJobIds = new Set<number>();

  readonly jobForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    employmentType: ['FullTime', Validators.required],
    budget: [0, Validators.required],
    recruiterId: [1, Validators.required],
    skillsText: [''],
    active: [true]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService,
    private readonly router: Router
  ) {}

  get canCreateJobs(): boolean {
    const role = this.auth.currentSession?.role;
    return role === 'RECRUITER' || role === 'ADMIN';
  }

  get isFreelancer(): boolean {
    return this.auth.currentSession?.role === 'FREELANCER';
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('job_search');
    if (stored) {
      this.searchTerm = stored;
    }
    this.loadJobs();
    this.loadAppliedJobs();
    this.api.getSkills().subscribe({
      next: (data) => (this.skills = data),
      error: () => (this.skills = [])
    });
  }

  loadJobs(): void {
    this.api.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.applyFilter(false);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not load jobs';
      }
    });
  }

  createJob(): void {
    if (this.jobForm.invalid) {
      return;
    }

    const raw = this.jobForm.getRawValue();
    this.resolveSkillIds(raw.skillsText).subscribe({
      next: (skillIds) => {
        this.api
          .createJob({
            title: raw.title,
            description: raw.description,
            location: raw.location,
            employmentType: raw.employmentType,
            budget: Number(raw.budget),
            recruiterId: Number(raw.recruiterId),
            skillIds,
            active: raw.active
          })
          .subscribe({
            next: () => {
              this.jobForm.patchValue({ title: '', description: '', location: '', budget: 0, skillsText: '' });
              this.loadJobs();
              this.errorMessage = '';
            },
            error: (error) => {
              this.errorMessage = error?.error?.message || 'Could not create job. Check recruiterId/skills.';
            }
          });
      },
      error: () => {
        this.errorMessage = 'Could not prepare skills';
      }
    });
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

  applyFilter(userTriggered = false): void {
    if (userTriggered) {
      this.searched = true;
    }
    const key = this.searchTerm.trim().toLowerCase();
    if (!key) {
      this.filteredJobs = [...this.jobs];
      return;
    }
    this.filteredJobs = this.jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(key) ||
        job.location.toLowerCase().includes(key) ||
        job.employmentType.toLowerCase().includes(key)
    );
  }

  quickType(type: string): void {
    if (!type) {
      this.clearFilter();
      return;
    }
    this.searchTerm = type;
    this.applyFilter(true);
  }

  clearFilter(): void {
    this.searchTerm = '';
    localStorage.removeItem('job_search');
    this.filteredJobs = [...this.jobs];
    this.searched = false;
  }

  goApply(): void {
    this.router.navigateByUrl('/applications');
  }

  isSaved(jobId: number): boolean {
    const saved = this.getSavedJobs();
    return saved.some((job) => job.jobId === jobId);
  }

  isApplied(jobId: number): boolean {
    if (this.appliedJobIds.has(jobId)) {
      return true;
    }
    const applied = this.getAppliedJobs();
    return applied.some((id) => id === jobId);
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

  private getAppliedJobs(): number[] {
    try {
      const raw = localStorage.getItem('applied_jobs');
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private loadAppliedJobs(): void {
    if (!this.isFreelancer) {
      return;
    }
    const email = this.auth.currentSession?.email;
    if (!email) {
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
}




