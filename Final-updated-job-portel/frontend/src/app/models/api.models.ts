export type Role = 'FREELANCER' | 'RECRUITER' | 'ADMIN';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  company?: string;
  profileTitle?: string;
  experience?: string;
  hourlyRate?: number;
  location?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Skill {
  skillId: number;
  name: string;
}

export interface Job {
  jobId: number;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  budget: number;
  postedDate: string;
  active: boolean;
  skills?: Skill[];
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  budget: number;
  active: boolean;
  recruiterId: number;
  skillIds: number[];
}

export interface UpdateJobRequest {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  budget: number;
  active: boolean;
  skillIds?: number[];
}

export interface Freelancer {
  freelancerId: number;
  name: string;
  email: string;
  profileTitle: string;
  experience: string;
  hourlyRate: number;
  location: string;
  available: boolean;
  verified?: boolean;
}

export interface CreateFreelancerRequest {
  name: string;
  email: string;
  password: string;
  profileTitle: string;
  experience: string;
  hourlyRate: number;
  location: string;
  available: boolean;
}

export interface Recruiter {
  recruiterId: number;
  name: string;
  email: string;
  company: string;
  verified: boolean;
}

export interface RecruiterAuthRequest {
  name?: string;
  email: string;
  password: string;
  company?: string;
}

export interface PendingRecruiter extends Recruiter {}

export interface JobApplicationPayload {
  jobId: number;
  freelancerId: number;
  coverLetter: string;
  resumeFile?: File;
}

export interface JobApplicationResponse {
  applicationId: number;
  coverLetter: string;
  resumeLink?: string;
  status: string;
  freelancer?: Freelancer;
  job?: Job;
}

export interface FeedbackPayload {
  recruiterId: number;
  freelancerId: number;
  rating: number;
  comment: string;
}

export interface FeedbackResponse {
  feedbackId: number;
  rating: number;
  comment: string;
  createdBy?: Recruiter;
  freelancer?: Freelancer;
}

export interface BookmarkFreelancerPayload {
  recruiterId: number;
  freelancerId: number;
  skillId?: number;
}

export interface BookmarkedFreelancer {
  id: number;
  skill?: Skill;
  freelancer?: Freelancer;
  bookmarkedBy?: Recruiter;
}
