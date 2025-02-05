import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdverseEventSeverity, CurrentStatus, PrepExperienceStatus, Visit } from '../../../../models/visit.model';
import { InjectionType } from '../../../../models/injection-type.enum';
import { VisitConfirmDialogComponent } from '../../../dialogs/visit-confirm-dialog/visit-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


const INITIATION_GAP_DAYS = 60;
const REINJECTION_GAP_DAYS = 90;

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
  injectionTypes: string[] = [];
  lastVisitDate: Date | null = null;
  lastInjectionType: string | null = null;
  isFirstVisit: boolean = true;
  isSequenceReset: boolean = false;

  currentStatusOptions = Object.values(CurrentStatus);
  adverseEventSeverityOptions = Object.values(AdverseEventSeverity);
  prepExperienceStatusOptions = Object.values(PrepExperienceStatus);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.visitForm = this.fb.group({
      prepNumber: ['', Validators.required],
      injectionDate: ['', Validators.required],
      typeOfInjection: ['', Validators.required],
      currentStatus: ['', Validators.required],
      discontinuationReason: [''],
      adverseEventSeverity: [null],
      prepExperienceStatus: ['',Validators.required]
    });

    this.visitForm.get('injectionDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.updateInjectionTypes(new Date(date));
      }
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

    if (this.prepNumber) {
      this.apiService.getVisitsByPrepNumber(this.prepNumber).subscribe({
        next: (visits) => {
          if (visits.length > 0) {
            this.isFirstVisit = false;
            // Sort visits by date
            const sortedVisits = visits.sort((a, b) => 
              new Date(b.injectionDate).getTime() - new Date(a.injectionDate).getTime()
            );
            
            this.lastVisitDate = new Date(sortedVisits[0].injectionDate);
            this.lastInjectionType = sortedVisits[0].typeOfInjection;
            
            // Update injection types based on current form date
            const currentDate = this.visitForm.get('injectionDate')?.value;
            if (currentDate) {
              this.updateInjectionTypes(new Date(currentDate));
            }
          } else {
            this.isFirstVisit = true;
            this.injectionTypes = [InjectionType.INITIATION_1];
            this.updatePrepExperienceOptions();
          }
        },
        error: (error) => {
          this.snackBar.open('Error fetching visit history: ' + error.message, 'Close', {
            duration: 5000
          });
        }
      });
    }

    this.visitForm.get('currentStatus')?.valueChanges.subscribe(status => {
      this.updateFieldVisibility(status);
    });
  }

  private updatePrepExperienceOptions(): void {
    if (this.isFirstVisit || this.isSequenceReset) {
      // Only show initiation options for first visit or sequence reset
      this.prepExperienceStatusOptions = [
        PrepExperienceStatus.NAIVE,
        PrepExperienceStatus.TRANSITIONING_OP,
        PrepExperienceStatus.TRANSITIONING_DVR
      ];
    } else {
      // Show follow-up option for regular visits
      this.prepExperienceStatusOptions = [
        PrepExperienceStatus.CAB_LA_FOLLOWUP_VISIT
      ];
    }

    // Reset the prepExperienceStatus if the current value is not in the new options
    const currentValue = this.visitForm.get('prepExperienceStatus')?.value;
    if (!this.prepExperienceStatusOptions.includes(currentValue)) {
      this.visitForm.patchValue({ prepExperienceStatus: '' });
    }
  }

  private updateInjectionTypes(currentDate: Date): void {
    if (!this.lastVisitDate || !this.lastInjectionType) {
      this.injectionTypes = [InjectionType.INITIATION_1];
      this.isSequenceReset = false;
      this.updatePrepExperienceOptions();
      return;
    }

    const daysSinceLastVisit = this.getDaysDifference(currentDate, this.lastVisitDate);

    // Check if we need to restart the sequence
    if (this.shouldRestartSequence(daysSinceLastVisit, this.lastInjectionType)) {
      this.showRestartDialog(daysSinceLastVisit);
      this.injectionTypes = [InjectionType.INITIATION_1];
      this.isSequenceReset = true;
      this.updatePrepExperienceOptions();
      return;
    }

    this.isSequenceReset = false;
    
    // Determine next injection type
    if (this.lastInjectionType === InjectionType.INITIATION_1 && daysSinceLastVisit <= INITIATION_GAP_DAYS) {
      this.injectionTypes = [InjectionType.INITIATION_2];
    } else if (this.lastInjectionType === InjectionType.INITIATION_2 && daysSinceLastVisit <= REINJECTION_GAP_DAYS) {
      this.injectionTypes = ['Reinjection 1'];
    } else if (this.lastInjectionType.startsWith('Reinjection') && daysSinceLastVisit <= REINJECTION_GAP_DAYS) {
      const lastNumber = this.getReInjectionNumber(this.lastInjectionType);
      this.injectionTypes = [`Reinjection ${lastNumber + 1}`];
    } else {
      this.injectionTypes = [InjectionType.INITIATION_1];
      this.isSequenceReset = true;
    }
    
    this.updatePrepExperienceOptions();
  }

  private shouldRestartSequence(daysSinceLastVisit: number, lastInjectionType: string): boolean {
    if (lastInjectionType === InjectionType.INITIATION_1 && daysSinceLastVisit > INITIATION_GAP_DAYS) {
      return true;
    }
    if (lastInjectionType === InjectionType.INITIATION_2 && daysSinceLastVisit > REINJECTION_GAP_DAYS) {
      return true;
    }
    if (lastInjectionType.startsWith('Reinjection') && daysSinceLastVisit > REINJECTION_GAP_DAYS) {
      return true;
    }
    return false;
  }

  private showRestartDialog(daysSinceLastVisit: number): void {
    const dialogRef = this.dialog.open(VisitConfirmDialogComponent, {
      data: {
        title: 'Injection Sequence Reset',
        message: `Due to a gap of ${daysSinceLastVisit} days since the last injection, 
                 the sequence must be restarted with Initiation Injection 1.`,
        confirmText: 'Understand',
        cancelText: 'Cancel'
      }
    });
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getReInjectionNumber(type: string): number {
    const match = type.match(/Reinjection (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  onSubmit(): void {
    if (this.visitForm.valid && this.patientId) {
      const visitDate = new Date(this.visitForm.value.injectionDate);
      
      // Final validation before submission
      if (this.lastVisitDate && this.lastInjectionType) {
        const daysSinceLastVisit = this.getDaysDifference(visitDate, this.lastVisitDate);
        if (this.shouldRestartSequence(daysSinceLastVisit, this.lastInjectionType)) {
          this.showRestartDialog(daysSinceLastVisit);
          return;
        }
      }

      this.loading = true;
      const visitData: Visit = {
        ...this.visitForm.getRawValue(),
        patient: { 
          patientId: this.patientId,
          prepNumber: this.prepNumber 
        },
        injectionDate: visitDate
      };

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

// Update Field Visibility
private updateFieldVisibility(status: string): void {
  if (status === 'D' || status === 'SWD') {
    this.visitForm.get('discontinuationReason')?.setValidators([Validators.required]);
    this.visitForm.get('adverseEventSeverity')?.clearValidators();
  } else if (status === 'AE') {
    this.visitForm.get('adverseEventSeverity')?.setValidators([Validators.required]);
    this.visitForm.get('discontinuationReason')?.clearValidators();
  } else if (status === 'AED') {
    this.visitForm.get('discontinuationReason')?.setValidators([Validators.required]);
    this.visitForm.get('adverseEventSeverity')?.setValidators([Validators.required]);
  } else {
    this.visitForm.get('discontinuationReason')?.clearValidators();
    this.visitForm.get('adverseEventSeverity')?.clearValidators();
  }
  this.visitForm.get('discontinuationReason')?.updateValueAndValidity();
  this.visitForm.get('adverseEventSeverity')?.updateValueAndValidity();
}
}