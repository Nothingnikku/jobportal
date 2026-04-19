import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FeedbackPayload, FeedbackResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private readonly api: ApiService) {}

  add(payload: FeedbackPayload): Observable<FeedbackResponse> {
    return this.api.addFeedback(payload);
  }

  getForFreelancer(freelancerId: number): Observable<FeedbackResponse[]> {
    return this.api.getFeedbackForFreelancer(freelancerId);
  }
}
