import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { MissingFollowUpDTO } from '../models/missing-follow-up-dto.model';
import { InjectionTrendDTO } from '../models/injection-trend-dto.model';
import { RetentionDTO } from '../models/retention-dto.model';
import { DemographicDTO } from '../models/demographic-dto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves population demographics data
   */
  getPopulationDemographics(): Observable<DemographicDTO[]> {
    return this.http.get<DemographicDTO[]>(`${this.apiUrl}/demographics`);
  }

  /**
   * Retrieves retention data by injection type
   */
  getRetentionByInjectionType(): Observable<RetentionDTO[]> {
    return this.http.get<RetentionDTO[]>(`${this.apiUrl}/retention`);
  }

  /**
   * Retrieves injection trends for a specific date range
   * @param startDate - Start date for the trend analysis
   * @param endDate - End date for the trend analysis
   */
  getInjectionTrends(startDate: Date, endDate: Date): Observable<InjectionTrendDTO[]> {
    let params = new HttpParams()
      .set('startDate', this.formatDate(startDate))
      .set('endDate', this.formatDate(endDate));

    return this.http.get<InjectionTrendDTO[]>(`${this.apiUrl}/injection-trends`, { params });
  }

  /**
   * Retrieves list of patients with missing follow-ups
   */
  getMissingFollowUps(): Observable<MissingFollowUpDTO[]> {
    return this.http.get<MissingFollowUpDTO[]>(`${this.apiUrl}/missing-followups`);
  }

  /**
   * Formats date to ISO string (YYYY-MM-DD)
   * @param date - Date to format
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Error handler for HTTP requests
   * @param error - Error object
   */
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error.message || error);
  }
}
