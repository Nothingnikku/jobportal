import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookmarkedFreelancer, Job } from '../../models/api.models';
import { ApiService } from '../../services/api.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  standalone: true,
  selector: 'app-bookmarks',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
  })
export class BookmarksComponent implements OnInit {
  bookmarks: BookmarkedFreelancer[] = [];
  recruiterSearchId = 0;
  outputText = '';
  errorMessage = '';
  savedJobs: Job[] = [];

  readonly bookmarkForm = this.fb.nonNullable.group({
    recruiterId: [0, Validators.required],
    freelancerId: [0, Validators.required],
    skillId: [0]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthStateService
  ) {}

  get isFreelancer(): boolean {
    return this.auth.currentSession?.role === 'FREELANCER';
  }

  ngOnInit(): void {
    if (this.isFreelancer) {
      this.loadSavedJobs();
    }
  }

  loadSavedJobs(): void {
    try {
      const raw = localStorage.getItem('saved_jobs');
      if (!raw) {
        this.savedJobs = [];
        return;
      }
      const parsed = JSON.parse(raw);
      this.savedJobs = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.savedJobs = [];
    }
  }

  removeSaved(jobId: number): void {
    this.savedJobs = this.savedJobs.filter((job) => job.jobId !== jobId);
    localStorage.setItem('saved_jobs', JSON.stringify(this.savedJobs));
  }

  bookmarkFreelancer(): void {
    if (this.bookmarkForm.invalid) {
      return;
    }
    const raw = this.bookmarkForm.getRawValue();
    this.api
      .bookmarkFreelancer({
        recruiterId: raw.recruiterId,
        freelancerId: raw.freelancerId,
        skillId: raw.skillId > 0 ? raw.skillId : undefined
      })
      .subscribe({
        next: () => {
          this.outputText = 'Freelancer bookmarked successfully.';
          this.errorMessage = '';
        },
        error: (error) => (this.errorMessage = error?.error?.message || 'Could not bookmark freelancer')
      });
  }

  loadBookmarks(): void {
    if (!this.recruiterSearchId) {
      return;
    }
    this.api.getBookmarkedFreelancersByRecruiter(this.recruiterSearchId).subscribe({
      next: (data) => {
        this.bookmarks = data;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not load bookmarks')
    });
  }
}




