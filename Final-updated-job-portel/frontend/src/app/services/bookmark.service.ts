import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BookmarkFreelancerPayload, BookmarkedFreelancer } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  constructor(private readonly api: ApiService) {}

  bookmarkFreelancer(payload: BookmarkFreelancerPayload): Observable<BookmarkedFreelancer> {
    return this.api.bookmarkFreelancer(payload);
  }

  getForRecruiter(recruiterId: number): Observable<BookmarkedFreelancer[]> {
    return this.api.getBookmarkedFreelancersByRecruiter(recruiterId);
  }
}
