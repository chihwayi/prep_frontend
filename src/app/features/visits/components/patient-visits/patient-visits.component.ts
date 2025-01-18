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
export class PatientVisitsComponent {
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
      // Load patient details
      this.apiService.getPatientById(patientId).subscribe(
        patient => {
          this.patient = patient;
          // Load patient's visits
          this.apiService.getVisitsByPatientId(patientId).subscribe(
            visits => {
              this.dataSource.data = visits;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.loading = false;
            },
            (            error: any) => {
              console.error('Error loading visits:', error);
              this.loading = false;
            }
          );
        },
        (        error: any) => {
          console.error('Error loading patient:', error);
          this.loading = false;
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
