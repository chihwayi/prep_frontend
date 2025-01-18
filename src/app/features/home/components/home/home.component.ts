import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { DashboardStats } from '../../../../models/dashboard-stats.model';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  stats: DashboardStats | null = null;
  
  cards = [
    {
      title: 'Patient Registry',
      description: 'View and manage all registered PrEP patients',
      icon: 'people',
      route: '/patients'
    },
    {
      title: 'Register New Patient',
      description: 'Add a new patient to the PrEP program',
      icon: 'person_add',
      route: '/patients/new'
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.apiService.getDashboardStats().subscribe(
      stats => this.stats = stats,
      error => console.error('Error loading dashboard stats:', error)
    );
  }

  getDistributionEntries(distribution: { [key: string]: number }): { key: string, value: number }[] {
    return Object.entries(distribution)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  formatLabel(label: string): string {
    return label.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}