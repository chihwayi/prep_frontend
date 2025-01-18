import { Component, OnInit } from '@angular/core';
import { Facility } from '../../../../models/facility.model';
import { FacilityService } from '../../../../services/facility.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-facility-setup',
  standalone: false,
  
  templateUrl: './facility-setup.component.html',
  styleUrl: './facility-setup.component.css'
})
export class FacilitySetupComponent implements OnInit {
  facilityForm: FormGroup;
  provinces: string[] = [];
  districts: string[] = [];
  facilities: Facility[] = [];
  loading = false;

  constructor(
    private facilityService: FacilityService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Initialize form with disabled states
    this.facilityForm = this.fb.group({
      province: new FormControl('', Validators.required),
      district: new FormControl({ value: '', disabled: true }, Validators.required),
      facility: new FormControl({ value: '', disabled: true }, Validators.required)
    });
  }

  ngOnInit() {
    this.checkExistingConfig();
    
    // Subscribe to province changes
    this.facilityForm.get('province')?.valueChanges.subscribe(province => {
      if (province) {
        this.facilityForm.get('district')?.enable();
        this.loadDistricts(province);
      } else {
        this.facilityForm.get('district')?.disable();
        this.facilityForm.get('facility')?.disable();
      }
    });

    // Subscribe to district changes
    this.facilityForm.get('district')?.valueChanges.subscribe(district => {
      if (district) {
        this.facilityForm.get('facility')?.enable();
        this.loadFacilities(district);
      } else {
        this.facilityForm.get('facility')?.disable();
      }
    });
  }

  private checkExistingConfig() {
    this.loading = true;
    this.facilityService.getConfig().subscribe({
      next: (config) => {
        if (config && config.length > 0) {
          this.router.navigate(['/home']);
        } else {
          this.loadProvinces();
        }
      },
      error: (error) => {
        this.showError('Error loading configuration');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadProvinces() {
    this.facilityService.getUniqueProvinces().subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: (error) => {
        this.showError('Error loading provinces');
      }
    });
  }

  private loadDistricts(province: string) {
    this.facilityForm.patchValue({ district: '', facility: '' }, { emitEvent: false });
    
    this.facilityService.getDistrictsByProvince(province).subscribe({
      next: (districts) => {
        this.districts = districts;
      },
      error: (error) => {
        this.showError('Error loading districts');
      }
    });
  }

  private loadFacilities(district: string) {
    this.facilityForm.patchValue({ facility: '' }, { emitEvent: false });
    
    this.facilityService.getFacilitiesByDistrict(district).subscribe({
      next: (facilities) => {
        this.facilities = facilities;
      },
      error: (error) => {
        this.showError('Error loading facilities');
      }
    });
  }

  saveFacility() {
    if (this.facilityForm.valid) {
      const siteCode = this.facilityForm.get('facility')?.value;
      this.loading = true;

      this.facilityService.saveConfig(siteCode).subscribe({
        next: () => {
          this.snackBar.open('Facility configuration saved successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.showError('Error saving facility configuration');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
