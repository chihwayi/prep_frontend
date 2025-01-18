import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password-dialog',
  standalone: false,
  
  template: `
    <h2 mat-dialog-title>Reset Password</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>New Password</mat-label>
        <input matInput type="password" [(ngModel)]="password">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="password">Reset</button>
    </mat-dialog-actions>
  `,
  styleUrl: './reset-password-dialog.component.css'
})
export class ResetPasswordDialogComponent {
  password: string = '';
}
