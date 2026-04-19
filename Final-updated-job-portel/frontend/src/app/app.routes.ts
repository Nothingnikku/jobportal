import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupRecruiterComponent } from './components/signup-recruiter/signup-recruiter.component';
import { SignupFreelancerComponent } from './components/signup-freelancer/signup-freelancer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { FreelancersComponent } from './components/freelancers/freelancers.component';
import { RecruitersComponent } from './components/recruiters/recruiters.component';
import { AdminComponent } from './components/admin/admin.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { authGuard } from './guards/auth.guard';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { FreelancerDashboardComponent } from './components/freelancer-dashboard/freelancer-dashboard.component';

export const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup-recruiter', component: SignupRecruiterComponent },
  { path: 'signup-freelancer', component: SignupFreelancerComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'recruiter-dashboard', component: RecruiterDashboardComponent, canActivate: [authGuard], data: { roles: ['RECRUITER'] } },
  { path: 'freelancer-dashboard', component: FreelancerDashboardComponent, canActivate: [authGuard], data: { roles: ['FREELANCER'] } },
  { path: 'jobs', component: JobsComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'RECRUITER', 'FREELANCER'] } },
  { path: 'freelancers', component: FreelancersComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'FREELANCER'] } },
  { path: 'recruiters', component: RecruitersComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'RECRUITER'] } },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'skills', component: SkillsComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'RECRUITER'] } },
  { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'RECRUITER', 'FREELANCER'] } },
  { path: 'feedback', component: FeedbackComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'RECRUITER'] } },
  { path: 'bookmarks', component: BookmarksComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'RECRUITER', 'FREELANCER'] } },
  { path: '**', redirectTo: '' }
];
