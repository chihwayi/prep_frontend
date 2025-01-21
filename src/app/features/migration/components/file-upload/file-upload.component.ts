import { Component } from '@angular/core';
import { MigrationService } from '../../../../services/migration.service';
import { MigrationResult } from '../../../../models/migration-result.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: false,

  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;
  migrationResult: MigrationResult | null = null;
  errorMessage: string | null = null;

  constructor(
    private migrationService: MigrationService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.errorMessage = null;
      this.migrationResult = null;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    if (!this.isExcelFile(this.selectedFile)) {
      this.errorMessage = 'Please select an Excel file (.xlsx or .xls)';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.migrationResult = null;

    this.migrationService
      .uploadExcelFile(this.selectedFile)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress =
              this.migrationService.getUploadProgress(event);
          } else if (event instanceof HttpResponse) {
            this.migrationResult = event.body;
            if (this.migrationResult?.successful) {
              this.snackBar.open(
                'Data migration completed successfully','Close',
                {
                  duration: 5000,
                  panelClass: ['success-snackbar'],
                }
              );
            }
          }
        },
        error: (error: { error: { message: string } }) => {
          this.errorMessage = error.error?.message || 'Failed to upload file';
          this.snackBar.open(
            'Error during migration', 'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  private isExcelFile(file: File): boolean {
    return file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  }

  clearFile(): void {
    this.selectedFile = null;
    this.errorMessage = null;
    this.migrationResult = null;
    this.uploadProgress = 0;
  }
}
