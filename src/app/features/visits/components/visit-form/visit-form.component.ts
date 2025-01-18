import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdverseEventSeverity, CurrentStatus, PrepExperienceStatus, Visit } from '../../../../models/visit.model';

@Component({
  selector: 'app-visit-form',
  standalone: false,
  
  templateUrl: './visit-form.component.html',
  styleUrl: './visit-form.component.css'
})
export class VisitFormComponent implements OnInit {
  visitForm: FormGroup;
  loading = false;
  prepNumber: string = '';
  patientId: string = '';
  discontinuationReason: string = '';

  currentStatusOptions = Object.values(CurrentStatus);
  adverseEventSeverityOptions = Object.values(AdverseEventSeverity);
  prepExperienceStatusOptions = Object.values(PrepExperienceStatus);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.visitForm = this.fb.group({
      prepNumber: ['', Validators.required],
      injectionDate: ['', Validators.required],
      typeOfInjection: ['', Validators.required],
      currentStatus: ['', Validators.required],
      discontinuationReason: [''],
      adverseEventSeverity: [null],
      prepExperienceStatus: [null]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['prepNumber']) {
        this.prepNumber = params['prepNumber'];
        this.visitForm.patchValue({ prepNumber: this.prepNumber });
        this.visitForm.get('prepNumber')?.disable();
      }
      if (params['patientId']) {
        this.patientId = params['patientId'];
      } else {
        // If no patientId in params, fetch it using prepNumber
        this.apiService.getPatientByPrepNumber(this.prepNumber).subscribe({
          next: (patient) => {
            this.patientId = patient.patientId ?? '';
          },
          error: (error) => {
            this.snackBar.open('Error fetching patient details: ' + error.message, 'Close', {
              duration: 5000
            });
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.visitForm.valid && this.patientId) {
      this.loading = true;
      const visitData: Visit = {
        ...this.visitForm.getRawValue(),
        patient: { 
          patientId: this.patientId,
          prepNumber: this.prepNumber 
        },
        injectionDate: new Date(this.visitForm.value.injectionDate)
      };

      this.apiService.recordVisit(visitData).subscribe({
        next: () => {
          this.snackBar.open('Visit recorded successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/patients']);
        },
        error: (error: { message: string }) => {
          this.snackBar.open('Error recording visit: ' + error.message, 'Close', {
            duration: 5000
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}