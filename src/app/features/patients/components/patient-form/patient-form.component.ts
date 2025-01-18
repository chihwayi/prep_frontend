import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { Patient, Sex, PopulationType } from '../../../../models/patient.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PatientExistsDialogComponent } from '../patient-exists-dialog/patient-exists-dialog.component';
import { NavigationDialogComponent } from '../navigation-dialog/navigation-dialog.component';


@Component({
  selector: 'app-patient-form',
  standalone: false,
  
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  loading = false;
  sexOptions = Object.values(Sex);
  populationTypes = Object.values(PopulationType);

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.patientForm = this.fb.group({
      prepNumber: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      populationType: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      const patientData: Patient = {
        ...this.patientForm.value,
        dob: new Date(this.patientForm.value.dob)
      };

      // First check if patient exists
      this.apiService.checkPatientExists(patientData.prepNumber).subscribe({
        next: (exists) => {
          if (exists) {
            this.handleExistingPatient();
          } else {
            this.registerNewPatient(patientData);
          }
        },
        error: (error) => {
          this.handleError(error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private registerNewPatient(patientData: Patient): void {
    this.apiService.registerPatient(patientData).subscribe({
      next: (response) => {
        // Now using the response which includes the patientId
        if (response.patientId) {
          this.openNavigationDialog(patientData.prepNumber, response.patientId);
        } else {
          this.handleError(new Error('Patient ID is undefined'));
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private openNavigationDialog(prepNumber: string, patientId: string): void {
    const dialogRef = this.dialog.open(NavigationDialogComponent, {
      width: '400px',
      data: {
        prepNumber: prepNumber,
        patientId: patientId  // Adding patientId to dialog data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'list') {
        this.router.navigate(['/patients']);
      } else if (result === 'visit') {
        this.router.navigate(['/visits/new'], { 
          queryParams: { 
            prepNumber,
            patientId  // Adding patientId to query params
          } 
        });
      }
    });
  }

  private handleExistingPatient(): void {
    const dialogRef = this.dialog.open(PatientExistsDialogComponent, {
      width: '400px',
      data: {
        message: 'Patient already exists!'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'list') {
        this.router.navigate(['/patients']);
      } else if (result === 'new') {
        this.patientForm.reset();
      }
    });
  }

  private handleError(error: any): void {
    this.loading = false;
    this.snackBar.open('Error: ' + error.message, 'Close', {
      duration: 5000
    });
  }
}