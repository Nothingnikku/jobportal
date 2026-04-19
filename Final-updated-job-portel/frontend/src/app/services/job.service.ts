import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateJobRequest, Job } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private readonly api: ApiService) {}

  getAll(): Observable<Job[]> {
    return this.api.getJobs();
  }

  getByRecruiter(recruiterId: number): Observable<Job[]> {
    return this.api.getJobsByRecruiter(recruiterId);
  }

  create(payload: CreateJobRequest): Observable<Job> {
    return this.api.createJob(payload);
  }

  update(jobId: number, payload: Partial<Job>): Observable<Job> {
    return this.api.updateJob(jobId, payload);
  }

  remove(jobId: number): Observable<void> {
    return this.api.deleteJob(jobId);
  }
}
