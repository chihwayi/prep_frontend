import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Patient Registered Successfully!</h2>
    <mat-dialog-content>
      What would you like to do next?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close('list')">Go to Patient List</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close('visit')">
        Capture Visit
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './navigation-dialog.component.css'
})
export class NavigationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NavigationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prepNumber: string }
  ) {}
}
