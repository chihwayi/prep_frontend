import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model'; 
import { Role } from '../models/role.model';
//import { environment } from '../../environments/environment.prod';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiBaseUrl}/admin`; 

  constructor(private http: HttpClient) {}


  // 1. Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRoles(userId: number, roles: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/roles`, roles);
  }
  
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/reset-password`, newPassword);
  }

  getRoles(): Observable<Role[]> {
    console.log('Fetching roles...');
    return this.http.get<Role[]>(`${this.apiUrl}/roles`)
      .pipe(
        tap(response => console.log('Roles received:', response)),
        catchError(error => {
          if (error.status === 403) {
            console.error('Error 403: Access denied. The user does not have permission to access this resource.');
            alert('You do not have permission to view the roles.');
          } else {
            console.error('Error fetching roles:', error);
            alert('An error occurred while fetching roles. Please try again later.');
          }
          return throwError(error);
        })
      );
  }
  
  
}