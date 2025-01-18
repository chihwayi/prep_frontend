import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-exists-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Patient Already Exists</h2>
    <mat-dialog-content>
      {{data.message}}
      What would you like to do?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close('new')">Register New Patient</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close('list')">
        Go to Patient List
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './patient-exists-dialog.component.css'
})
export class PatientExistsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PatientExistsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}

