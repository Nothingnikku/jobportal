import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BookmarkFreelancerPayload,
  BookmarkedFreelancer,
  CreateFreelancerRequest,
  CreateJobRequest,
  UpdateJobRequest,
  FeedbackPayload,
  FeedbackResponse,
  Freelancer,
  Job,
  JobApplicationPayload,
  JobApplicationResponse,
  LoginRequest,
  Recruiter,
  RecruiterAuthRequest,
  SignupRequest,
  Skill
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:8081';

  constructor(private readonly http: HttpClient) {}

  signup(payload: SignupRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/authentication/signup`, payload, {
      responseType: 'text'
    });
  }

  login(payload: LoginRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/authentication/login`, payload, {
      responseType: 'text'
    });
  }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/api/jobs`);
  }

  getJobsForFreelancer(freelancerId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/api/jobs/freelancer/${freelancerId}`);
  }

  getJobsByRecruiter(recruiterId: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/api/jobs/recruiter/${recruiterId}`);
  }

  createJob(payload: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/api/jobs`, payload);
  }

  updateJob(jobId: number, payload: UpdateJobRequest): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/api/jobs/${jobId}`, payload);
  }

  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/jobs/${jobId}`);
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/api/skills`);
  }

  createSkill(payload: { name: string }): Observable<Skill> {
    return this.http.post<Skill>(`${this.baseUrl}/api/skills`, payload);
  }

  getSkillById(id: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.baseUrl}/api/skills/${id}`);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/skills/${id}`);
  }

  getFreelancers(): Observable<Freelancer[]> {
    return this.http.get<Freelancer[]>(`${this.baseUrl}/api/freelancers`);
  }

  createFreelancer(payload: CreateFreelancerRequest): Observable<Freelancer> {
    return this.http.post<Freelancer>(`${this.baseUrl}/api/freelancers`, payload);
  }

  getRecruiters(): Observable<Recruiter[]> {
    return this.http.get<Recruiter[]>(`${this.baseUrl}/api/recruiters`);
  }

  registerRecruiter(payload: RecruiterAuthRequest): Observable<Recruiter> {
    return this.http.post<Recruiter>(`${this.baseUrl}/api/recruiters/register`, payload);
  }

  loginRecruiter(payload: RecruiterAuthRequest): Observable<Recruiter> {
    return this.http.post<Recruiter>(`${this.baseUrl}/api/recruiters/login`, payload);
  }

  getAllRecruitersForAdmin(): Observable<Recruiter[]> {
    return this.http.get<Recruiter[]>(`${this.baseUrl}/admin/recruiters`);
  }

  deleteRecruiter(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/api/recruiters/${id}`, { responseType: 'text' });
  }

  getUnverifiedRecruiters(): Observable<Recruiter[]> {
    return this.http.get<Recruiter[]>(`${this.baseUrl}/admin/recruiters/unverified`);
  }

  verifyRecruiter(recruiterId: number): Observable<Recruiter> {
    return this.http.put<Recruiter>(`${this.baseUrl}/admin/recruiter/${recruiterId}/verify`, {});
  }

  getAllFreelancersForAdmin(): Observable<Freelancer[]> {
    return this.http.get<Freelancer[]>(`${this.baseUrl}/admin/freelancers`);
  }

  deleteFreelancer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/freelancers/${id}`);
  }

  getUnverifiedFreelancers(): Observable<Freelancer[]> {
    return this.http.get<Freelancer[]>(`${this.baseUrl}/admin/freelancers/unverified`);
  }

  verifyFreelancer(freelancerId: number): Observable<Freelancer> {
    return this.http.put<Freelancer>(`${this.baseUrl}/admin/freelancer/${freelancerId}/verify`, {});
  }

  rejectRecruiter(recruiterId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/admin/recruiter/${recruiterId}/reject`, { responseType: 'text' });
  }

  rejectFreelancer(freelancerId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/admin/freelancer/${freelancerId}/reject`, { responseType: 'text' });
  }

  applyJob(payload: JobApplicationPayload): Observable<JobApplicationResponse> {
    const form = new FormData();
    form.append('jobId', String(payload.jobId));
    form.append('freelancerId', String(payload.freelancerId));
    form.append('coverLetter', payload.coverLetter);
    if (payload.resumeFile) {
      form.append('resume', payload.resumeFile);
    }
    return this.http.post<JobApplicationResponse>(`${this.baseUrl}/jobapplication/apply`, form);
  }

  updateJobApplication(payload: JobApplicationPayload): Observable<JobApplicationResponse> {
    return this.http.put<JobApplicationResponse>(`${this.baseUrl}/jobapplication/update`, payload);
  }

  updateApplicationStatus(id: number, status: string): Observable<JobApplicationResponse> {
    return this.http.put<JobApplicationResponse>(`${this.baseUrl}/jobapplication/${id}/status?status=${encodeURIComponent(status)}`, {});
  }

  removeJobApplication(payload: JobApplicationPayload): Observable<string> {
    return this.http.request('delete', `${this.baseUrl}/jobapplication/remove`, {
      body: payload,
      responseType: 'text'
    });
  }

  getJobApplicationById(id: number): Observable<JobApplicationResponse> {
    return this.http.get<JobApplicationResponse>(`${this.baseUrl}/jobapplication/${id}`);
  }

  getAllJobApplications(): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(`${this.baseUrl}/jobapplication`);
  }

  addFeedback(payload: FeedbackPayload): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(`${this.baseUrl}/feedback/add`, payload);
  }

  getFeedbackForFreelancer(freelancerId: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${this.baseUrl}/feedback/freelancer/${freelancerId}`);
  }

  bookmarkFreelancer(payload: BookmarkFreelancerPayload): Observable<BookmarkedFreelancer> {
    return this.http.post<BookmarkedFreelancer>(`${this.baseUrl}/api/bookmark/freelancer`, payload);
  }

  getBookmarkedFreelancersByRecruiter(recruiterId: number): Observable<BookmarkedFreelancer[]> {
    return this.http.get<BookmarkedFreelancer[]>(`${this.baseUrl}/api/bookmark/freelancer/recruiter/${recruiterId}`);
  }

  sendVerificationCode(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/authentication/send-code`, { email }, { responseType: 'text' });
  }

  verifyCode(email: string, code: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/authentication/verify-code`, { email, code }, { responseType: 'text' });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/authentication/reset-password`, { email, code, newPassword }, { responseType: 'text' });
  }
}

