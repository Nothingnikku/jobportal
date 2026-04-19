import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .category-card {
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 .75rem 1.5rem rgba(0, 0, 0, .15);
    }
  `],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  })
export class DashboardComponent {
  keyword = '';

  constructor(private readonly router: Router) {}

  applyFilter(): void {
    const key = this.keyword.trim();
    if (key) {
      localStorage.setItem('job_search', key);
    } else {
      localStorage.removeItem('job_search');
    }
    this.router.navigateByUrl('/jobs');
  }
}




