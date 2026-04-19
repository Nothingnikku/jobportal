import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Freelancer, Recruiter, Job, JobApplicationResponse } from '../../models/api.models';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  })
export class AdminComponent implements OnInit {
  pendingRecruiters: Recruiter[] = [];
  recruiters: Recruiter[] = [];
  freelancers: Freelancer[] = [];
  pendingFreelancers: Freelancer[] = [];
  jobs: Job[] = [];
  applications: JobApplicationResponse[] = [];
  errorMessage = '';

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.loadPendingRecruiters();
    this.loadAllRecruiters();
    this.loadFreelancers();
    this.loadPendingFreelancers();
    this.loadJobs();
    this.loadApplications();
  }

  loadPendingRecruiters(): void {
    this.api.getUnverifiedRecruiters().subscribe({
      next: (data) => {
        this.pendingRecruiters = data;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not load pending recruiters')
    });
  }

  loadAllRecruiters(): void {
    this.api.getAllRecruitersForAdmin().subscribe({
      next: (data) => (this.recruiters = data),
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not load recruiters')
    });
  }

  loadFreelancers(): void {
    this.api.getAllFreelancersForAdmin().subscribe({
      next: (data) => (this.freelancers = data),
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not load freelancers')
    });
  }

  approveRecruiter(recruiterId: number): void {
    this.api.verifyRecruiter(recruiterId).subscribe({
      next: () => {
        this.loadPendingRecruiters();
        this.loadAllRecruiters();
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not approve recruiter')
    });
  }

  rejectRecruiter(recruiterId: number): void {
    this.api.rejectRecruiter(recruiterId).subscribe({
      next: () => {
        this.loadPendingRecruiters();
        this.loadAllRecruiters();
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not reject recruiter')
    });
  }

  loadPendingFreelancers(): void {
    this.api.getUnverifiedFreelancers().subscribe({
      next: (data) => {
        this.pendingFreelancers = data;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not load pending freelancers')
    });
  }

  approveFreelancer(freelancerId: number): void {
    this.api.verifyFreelancer(freelancerId).subscribe({
      next: () => {
        this.loadPendingFreelancers();
        this.loadFreelancers();
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not approve freelancer')
    });
  }

  rejectFreelancer(freelancerId: number): void {
    this.api.rejectFreelancer(freelancerId).subscribe({
      next: () => {
        this.loadPendingFreelancers();
        this.loadFreelancers();
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not reject freelancer')
    });
  }

  loadJobs(): void {
    this.api.getJobs().subscribe({
      next: (data) => (this.jobs = data),
      error: () => (this.jobs = [])
    });
  }

  deleteJob(jobId: number): void {
    this.api.deleteJob(jobId).subscribe({
      next: () => this.loadJobs(),
      error: () => {}
    });
  }

  deleteRecruiter(recruiterId: number): void {
    if (!confirm('Delete this recruiter?')) {
      return;
    }
    this.api.deleteRecruiter(recruiterId).subscribe({
      next: () => this.loadAllRecruiters(),
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not delete recruiter')
    });
  }

  deleteFreelancer(freelancerId: number): void {
    if (!confirm('Delete this freelancer?')) {
      return;
    }
    this.api.deleteFreelancer(freelancerId).subscribe({
      next: () => this.loadFreelancers(),
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not delete freelancer')
    });
  }

  loadApplications(): void {
    this.api.getAllJobApplications().subscribe({
      next: (data) => (this.applications = data),
      error: () => (this.applications = [])
    });
  }
}



