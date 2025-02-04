import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Config } from '../models/config.model';
import { Facility } from '../models/facility.model';
import { environment } from '../../environments/environment';
//import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getConfig(): Observable<Config[]> {
    return this.http.get<Config[]>(`${this.baseUrl}/config/current`);
  }

  getAllFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.baseUrl}/facilities`);
  }

  saveConfig(siteCode: string): Observable<Config> {
    return this.http.post<Config>(`${this.baseUrl}/config/save`, { siteCode });
  }

  getCurrentFacility(siteCode: string): Observable<Facility> {
    return this.http.get<Facility>(`${this.baseUrl}/facilities/${siteCode}`);
  }

  getUniqueProvinces(): Observable<string[]> {
    return this.getAllFacilities().pipe(
      map(facilities => [...new Set(facilities.map(f => f.province))])
    );
  }

  getDistrictsByProvince(province: string): Observable<string[]> {
    return this.getAllFacilities().pipe(
      map(facilities => 
        [...new Set(facilities
          .filter(f => f.province === province)
          .map(f => f.district))]
      )
    );
  }

  getFacilitiesByDistrict(district: string): Observable<Facility[]> {
    return this.getAllFacilities().pipe(
      map(facilities => facilities.filter(f => f.district === district))
    );
  }
}
