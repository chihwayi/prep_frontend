import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Facility } from '../../../../models/facility.model';
import { Config } from '../../../../models/config.model';
import { FacilityService } from '../../../../services/facility.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy {
  title = 'PrEP Management System';
  currentUser: any = null;
  private userSubscription?: Subscription;
  currentFacility: Facility | null = null;
  currentConfig: Config | null = null;

  constructor(private authService: AuthService, private facilityService: FacilityService, private router: Router) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Current user updated:', user);
      },
      error: (error) => {
        console.error('Error in user subscription:', error);
      }
    });

    this.loadCurrentConfig();
  }

  private loadCurrentFacility(siteCode: string) {
    this.facilityService.getCurrentFacility(siteCode).subscribe({
      next: (facility) => {
        this.currentFacility = facility;
      },
      error: (error) => {
        console.error('Error loading facility:', error);
      }
    });
  }

  private loadCurrentConfig() {
    this.facilityService.getConfig().subscribe({
      next: (config) => {
        this.currentConfig = config[0]; 
        this.loadCurrentFacility(this.currentConfig.siteCode);
      },
      error: (error) => {
        console.error('Error loading config:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getCurrentUser() {
    const user = this.currentUser;
    console.log('Getting current user:', user);
    return user;
  }

  getUserRoles(): string {
    console.log('Getting user roles, currentUser:', this.currentUser);
    if (this.currentUser?.roles) {
      const roles = this.currentUser.roles.map((role: any) => {
        return typeof role === 'string' ? role : role.name || role;
      });
      console.log('Processed roles:', roles);
      return roles.join(', ');
    }
    return 'No roles assigned';
  }

  isAdmin(): boolean {
    return this.authService.hasRole(['ROLE_ADMIN']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}