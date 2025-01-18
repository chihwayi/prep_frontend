import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Patient } from '../models/patient.model';
import { Visit } from '../models/visit.model';
import { MigrationResult } from '../models/migration-result.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Migration endpoints
  importExcelData(file: File): Observable<MigrationResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MigrationResult>(`${this.baseUrl}/migrate/import-excel`, formData);
  }

  // Patient endpoints
  registerPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/patients/register`, patient);
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/patientid/${id}`);
  }

  getPatientByPrepNumber(prepNumber: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/prepnumber/${prepNumber}`);
  }

  getVisitsByPrepNumber(prepNumber: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/patients/${prepNumber}/visits`);
  }


  getPatients(
    page: number = 0,
    pageSize: number = 10,
    sort: string = 'prepNumber',
    order: 'asc' | 'desc' = 'asc',
    filter?: string
  ): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort', sort)
      .set('order', order);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<PaginatedResponse<Patient>>(`${this.baseUrl}/patients`, { params });
  }

  checkPatientExists(prepNumber: string): Observable<boolean> {
    return this.http.get<any>(`${this.baseUrl}/patients/check/${prepNumber}`).pipe(
      map(response => response.exists),
      catchError(this.handleError)
    );
  }

  // Visit endpoints
  addVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(`${this.baseUrl}/visits/new_visit`, visit);
  }

  getVisitsByPatientId(patientId: string): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/visits/patient/${patientId}`);
  }

  recordVisit(visitData: Visit): Observable<any> {
    // Ensure dates are properly formatted before sending
    const formattedVisitData = {
      ...visitData,
      visitDate: this.formatDate(visitData.injectionDate)
    };

    return this.http.post(`${this.baseUrl}/visits/new_visit`, formattedVisitData).pipe(
      catchError(this.handleError)
    );
  }

  //Dashboadr endpoints
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}
