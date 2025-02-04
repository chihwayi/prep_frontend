import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
//import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let storedUser = null;
    
    if (isPlatformBrowser(this.platformId)) {
      storedUser = localStorage.getItem('currentUser');
    }
    
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getCurrentUser() {
    return this.currentUserSubject.value;
  }

  public hasRole(roles: string[]): boolean {
    if (!this.currentUserSubject.value || !this.currentUserSubject.value.roles) {
      return false;
    }
    return roles.some(role => this.currentUserSubject.value.roles.includes(role));
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(usernameOrEmail: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { usernameOrEmail, password })
      .pipe(map(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  register(username: string, email: string, password: string, roles: string[] = ['user']) {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      roles
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue?.token;
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }
}