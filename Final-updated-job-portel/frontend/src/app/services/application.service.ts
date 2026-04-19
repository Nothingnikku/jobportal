import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JobApplicationPayload, JobApplicationResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  constructor(private readonly api: ApiService) {}

  apply(payload: JobApplicationPayload): Observable<JobApplicationResponse> {
    return this.api.applyJob(payload);
  }

  getAll(): Observable<JobApplicationResponse[]> {
    return this.api.getAllJobApplications();
  }

  getById(id: number): Observable<JobApplicationResponse> {
    return this.api.getJobApplicationById(id);
  }

  updateStatus(id: number, status: string): Observable<JobApplicationResponse> {
    return this.api.updateApplicationStatus(id, status);
  }
}
