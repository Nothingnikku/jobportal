import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Skill } from '../../models/api.models';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-skills',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  })
export class SkillsComponent implements OnInit {
  skills: Skill[] = [];
  selectedSkill: Skill | null = null;
  skillSearchId = 0;
  errorMessage = '';

  readonly skillForm = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.api.getSkills().subscribe({
      next: (data) => {
        this.skills = data;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not load skills')
    });
  }

  createSkill(): void {
    if (this.skillForm.invalid) {
      return;
    }
    this.api.createSkill(this.skillForm.getRawValue()).subscribe({
      next: () => {
        this.skillForm.patchValue({ name: '' });
        this.loadSkills();
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not create skill')
    });
  }

  loadSkillById(): void {
    if (!this.skillSearchId) {
      return;
    }
    this.api.getSkillById(this.skillSearchId).subscribe({
      next: (data) => {
        this.selectedSkill = data;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Skill not found')
    });
  }

  deleteSkill(id: number): void {
    this.api.deleteSkill(id).subscribe({
      next: () => this.loadSkills(),
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not delete skill')
    });
  }
}




