import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_URL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/users`);
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/roles`);
  }

  updateUserRoles(userId: number, roles: string[]): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${userId}/roles`, roles);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${userId}`);
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${userId}/reset-password`, newPassword);
  }
}