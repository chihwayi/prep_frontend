import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-patient-visits',
  standalone: false,
  
  templateUrl: './patient-visits.component.html',
  styleUrl: './patient-visits.component.css'
})
export class PatientVisitsComponent implements OnInit {
  patient: any;
  loading = false;
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'injectionDate',
    'typeOfInjection',
    'currentStatus',
    'discontinuationReason',
    'adverseEventSeverity',
    'prepExperienceStatus'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.loading = true;
    const patientId = this.route.snapshot.paramMap.get('id');
    
    if (patientId) {
      this.apiService.getPatientById(patientId).subscribe({
        next: (patient) => {
          this.patient = patient;
          this.loadVisits(patientId);
        },
        error: (error) => {
          console.error('Error loading patient:', error);
          this.loading = false;
        }
      });
    }
  }

  private loadVisits(patientId: string) {
    this.apiService.getVisitsByPatientId(patientId).subscribe({
      next: (visits) => {
        // Ensure proper date parsing and sorting
        const processedVisits = visits.map(visit => ({
          ...visit,
          // Force UTC parsing to avoid timezone issues
          injectionDate: this.parseDate(visit.injectionDate)
        }));

        // Sort visits by date in descending order
        const sortedVisits = processedVisits.sort((a, b) => {
          return b.injectionDate.getTime() - a.injectionDate.getTime();
        });

        console.log('Sorted visits:', sortedVisits.map(v => ({
          date: v.injectionDate,
          timestamp: v.injectionDate.getTime(),
          type: v.typeOfInjection
        })));

        this.dataSource = new MatTableDataSource(sortedVisits);
        this.setupDataSource();
      },
      error: (error) => {
        console.error('Error loading visits:', error);
        this.loading = false;
      }
    });
  }

  private parseDate(dateStr: string | Date): Date {
    if (dateStr instanceof Date) {
      return dateStr;
    }
    
    // Handle various date string formats
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateStr);
      return new Date(0); // fallback to epoch if invalid
    }
    return date;
  }

  private setupDataSource() {
    // Set up sorting
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'injectionDate':
          return item.injectionDate.getTime();
        default:
          return item[property];
      }
    };

    // Set up filtering
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dateStr = data.injectionDate.toLocaleDateString();
      const searchStr = Object.values(data)
        .map(val => {
          if (val instanceof Date) {
            return val.toLocaleDateString();
          }
          return val;
        })
        .join('').toLowerCase();
      return searchStr.includes(filter.toLowerCase());
    };

    // Set up paginator and sort
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Ensure default sorting
    if (this.sort) {
      this.sort.sort({
        id: 'injectionDate',
        start: 'desc',
        disableClear: false
      });
    }

    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Format date for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}