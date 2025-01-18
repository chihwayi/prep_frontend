import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MigrationResult } from '../models/migration-result.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private readonly API_URL = 'http://localhost:8080/api/migrate';

  constructor(private http: HttpClient) {}

  uploadExcelFile(file: File): Observable<HttpEvent<MigrationResult>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MigrationResult>(`${this.API_URL}/import-excel`, formData, {
      reportProgress: true,
      observe: 'events'
    });
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
