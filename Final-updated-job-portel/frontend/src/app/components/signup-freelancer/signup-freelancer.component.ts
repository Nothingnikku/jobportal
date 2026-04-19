import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { EmailJsService } from '../../services/emailjs.service';
import { Skill } from '../../models/api.models';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-signup-freelancer',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-freelancer.component.html',
  styleUrls: ['./signup-freelancer.component.css'],
  })
export class SignupFreelancerComponent implements OnInit {
  skills: Skill[] = [];
  verified = false;
  success = '';
  error = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profileTitle: ['', Validators.required],
    experience: ['', Validators.required],
    hourlyRate: [0, Validators.required],
    location: ['', Validators.required],
    skillsText: [''],
    code: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly emailjs: EmailJsService
  ) {}

  ngOnInit(): void {
    this.api.getSkills().subscribe({
      next: (data) => (this.skills = data),
      error: () => (this.skills = [])
    });
  }

  sendCode(): void {
    const email = this.form.getRawValue().email;
    this.api.sendVerificationCode(email).subscribe({
      next: async (resp) => {
        const code = resp.replace('CODE:', '').trim();
        // try {
        //   const status = await this.emailjs.sendVerification(email, code);
        //   this.success = `Verification code sent to email. (${status})`;
        //   this.error = '';
        // } catch (err: any) {
        //   this.error = err?.message || 'EmailJS send failed';
        //   this.success = '';
        // }
      },
      error: () => {
        this.error = 'Could not send verification code';
        this.success = '';
      }
    });
  }

  verifyCode(): void {
    const { email, code } = this.form.getRawValue();
    this.api.verifyCode(email, code).subscribe({
      next: (resp) => {
        this.verified = resp === 'VERIFIED';
        this.success = this.verified ? 'Email verified.' : '';
        this.error = this.verified ? '' : 'Invalid code';
      },
      error: () => {
        this.error = 'Invalid code';
        this.success = '';
      }
    });
  }

  submit(): void {
    if (this.form.invalid || !this.verified) {
      return;
    }
    const raw = this.form.getRawValue();
    this.resolveSkillIds(raw.skillsText).subscribe({
      next: (skillIds) => {
        this.api.signup({
          name: raw.name,
          email: raw.email,
          password: raw.password,
          phone: '9876543210',
          role: 'FREELANCER',
          profileTitle: raw.profileTitle,
          experience: raw.experience,
          hourlyRate: raw.hourlyRate,
          location: raw.location,
          skillIds
        } as any).subscribe({
          next: () => {
            this.success = 'Signup request sent to admin.';
            this.error = '';
          },
          error: (err) => {
            this.error = err?.error || 'Signup failed';
            this.success = '';
          }
        });
      },
      error: () => {
        this.error = 'Could not prepare skills';
        this.success = '';
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
}


