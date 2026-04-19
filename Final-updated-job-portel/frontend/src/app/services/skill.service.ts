import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Skill } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SkillService {
  constructor(private readonly api: ApiService) {}

  getAll(): Observable<Skill[]> {
    return this.api.getSkills();
  }

  create(name: string): Observable<Skill> {
    return this.api.createSkill({ name });
  }

  remove(id: number): Observable<void> {
    return this.api.deleteSkill(id);
  }
}
