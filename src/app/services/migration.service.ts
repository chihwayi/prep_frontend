import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { MigrationResult } from '../models/migration-result.model';
import { environment } from '../../environments/environment';
//import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private readonly API_URL = `${environment.apiBaseUrl}/migrate`;

  constructor(private http: HttpClient) {}

  uploadExcelFile(file: File): Observable<HttpEvent<MigrationResult>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MigrationResult>(`${this.API_URL}/import-excel`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(error => {
        // If the error response contains a MigrationResult object
        if (error.error instanceof Object && 'message' in error.error) {
          return throwError(() => error);
        }
        // If it's a different type of error
        return throwError(() => ({
          error: {
            message: 'Failed to upload file: Network or server error'
          }
        }));
      })
    );
  }

  getUploadProgress(event: HttpEvent<any>): number {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return Math.round((100 * event.loaded) / (event.total ?? 1));
      case HttpEventType.Response:
        return 100;
      default:
        return 0;
    }
  }
}