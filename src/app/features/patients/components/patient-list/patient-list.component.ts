import { Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from '../../../../models/patient.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-list',
  standalone: false,
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = [
    'prepNumber', 
    'dob', 
    'sex', 
    'populationType', 
    'lastVisit',
    'status',
    'actions'
  ];
  dataSource!: MatTableDataSource<Patient>;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Patient>([]);
  }

  viewVisits(patient: any): void {
    this.router.navigate(['/patients', patient.patientId, 'visits']);
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom sort function to handle dates and nested data
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'lastVisit':
          return item.visits?.length ? new Date(item.visits[item.visits.length - 1].injectionDate).getTime() : 0;
        case 'status':
          return item.visits?.length ? item.visits[item.visits.length - 1].currentStatus : '';
        case 'dob':
          return new Date(item.dob).getTime();
        default:
          return (item as any)[property];
      }
    };

    // Custom filter predicate to handle nested data
    this.dataSource.filterPredicate = (data: Patient, filter: string) => {
      const searchStr = (
        data.prepNumber +
        data.sex +
        data.populationType +
        new Date(data.dob).toLocaleDateString() +
        (data.visits?.length ? data.visits[data.visits.length - 1].currentStatus : '')
      ).toLowerCase();
      
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };
  }

  loadPatients(): void {
    this.loading = true;
    this.apiService.getPatients().subscribe({
      next: (response) => {
        // Extract the content from the paginated response
        this.dataSource.data = response.content;
      },
      error: (error) => {
        this.snackBar.open('Error loading patients: ' + error.message, 'Close', {
          duration: 5000
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getLastVisit(patient: Patient): string {
    if (patient.visits?.length > 0) {
      const lastVisit = patient.visits[patient.visits.length - 1];
      return new Date(lastVisit.injectionDate).toLocaleDateString();
    }
    return 'No Injectinons';
  }

  getCurrentStatus(patient: Patient): string {
    if (patient.visits?.length > 0) {
      return patient.visits[patient.visits.length - 1].currentStatus.toString();
    }
    return 'N/A';
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'D': return 'red';
      case 'AE': return 'orange';
      default: return 'green';
    }
  }

  addVisit(patient: Patient): void {
    this.router.navigate(['/visits/new'], { 
      queryParams: { prepNumber: patient.prepNumber }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Patient, filter: string) => {
      const searchStr = (
        data.prepNumber +
        data.sex +
        data.populationType +
        new Date(data.dob).toLocaleDateString() +
        (data.visits?.length ? data.visits[data.visits.length - 1].currentStatus : '')
      ).toLowerCase();
      
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };
    
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

