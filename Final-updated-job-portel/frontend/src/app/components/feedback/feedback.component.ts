import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackResponse } from '../../models/api.models';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-feedback',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  })
export class FeedbackComponent {
  resultText = '';
  errorMessage = '';
  lastFeedback: FeedbackResponse | null = null;

  readonly feedbackForm = this.fb.nonNullable.group({
    recruiterId: [0, Validators.required],
    freelancerId: [0, Validators.required],
    rating: [5, Validators.required],
    comment: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {}

  submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      return;
    }
    this.api.addFeedback(this.feedbackForm.getRawValue()).subscribe({
      next: (data) => {
        this.lastFeedback = data;
        this.resultText = `Feedback submitted successfully. ID: ${data.feedbackId}`;
        this.errorMessage = '';
      },
      error: (error) => (this.errorMessage = error?.error?.message || 'Could not submit feedback')
    });
  }
}




