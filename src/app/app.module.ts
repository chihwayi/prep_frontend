import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { AppComponent } from './app.component';
import { PatientListComponent } from './features/patients/components/patient-list/patient-list.component';
import { PatientFormComponent } from './features/patients/components/patient-form/patient-form.component';
import { VisitListComponent } from './features/visits/components/visit-list/visit-list.component';
import { VisitFormComponent } from './features/visits/components/visit-form/visit-form.component';
import { FileUploadComponent } from './features/migration/components/file-upload/file-upload.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PatientExistsDialogComponent } from './features/patients/components/patient-exists-dialog/patient-exists-dialog.component';
import { NavigationDialogComponent } from './features/patients/components/navigation-dialog/navigation-dialog.component';
import { PatientVisitsComponent } from './features/visits/components/patient-visits/patient-visits.component';
import { NavComponent } from './features/home/components/nav/nav.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { LoginComponent } from './features/prep/components/login/login.component';
import { RegisterComponent } from './features/prep/components/register/register.component';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { RoleManagementComponent } from './features/prep/components/role-management/role-management.component';
import { ResetPasswordDialogComponent } from './features/dialogs/reset-password-dialog/reset-password-dialog.component';
import { ConfirmDialogComponent } from './features/dialogs/confirm-dialog/confirm-dialog.component';
import { FacilitySetupComponent } from './features/prep/components/facility-setup/facility-setup.component';
import { VisitConfirmDialogComponent } from './features/dialogs/visit-confirm-dialog/visit-confirm-dialog.component';
import { ReportsDashboardComponent } from './features/reports/reports-dashboard/reports-dashboard.component';
import { DemographicsReportComponent } from './features/reports/demographics-report/demographics-report.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientListComponent,
    PatientFormComponent,
    VisitListComponent,
    VisitFormComponent,
    FileUploadComponent,
    PatientExistsDialogComponent,
    NavigationDialogComponent,
    PatientVisitsComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RoleManagementComponent,
    ResetPasswordDialogComponent,
    ConfirmDialogComponent,
    FacilitySetupComponent,
    VisitConfirmDialogComponent,
    ReportsDashboardComponent,
    DemographicsReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatChipsModule,
    MatMenuModule,
    FormsModule,
    MatListModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTabsModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
