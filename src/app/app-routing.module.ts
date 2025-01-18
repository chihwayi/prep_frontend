import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientFormComponent } from './features/patients/components/patient-form/patient-form.component';
import { PatientListComponent } from './features/patients/components/patient-list/patient-list.component';
import { VisitFormComponent } from './features/visits/components/visit-form/visit-form.component';
import { FileUploadComponent } from './features/migration/components/file-upload/file-upload.component';
import { PatientVisitsComponent } from './features/visits/components/patient-visits/patient-visits.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { LoginComponent } from './features/prep/components/login/login.component';
import { RegisterComponent } from './features/prep/components/register/register.component';
import { RoleManagementComponent } from './features/prep/components/role-management/role-management.component';
import { AuthGuard } from './guard/auth.guard';
import { FacilitySetupComponent } from './features/prep/components/facility-setup/facility-setup.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'facility-setup',
    component: FacilitySetupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    canActivate: [AuthGuard],
    children: [
      { path: 'register', component: PatientFormComponent },
      { path: 'list', component: PatientListComponent },
      { path: 'new', component: PatientFormComponent },
      { path: ':id/visits', component: PatientVisitsComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'visits',
    canActivate: [AuthGuard],
    children: [
      { path: 'new', component: VisitFormComponent },
      { path: ':prepNumber', component: VisitFormComponent },
    ],
  },
  {
    path: 'migrate',
    component: FileUploadComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  //{ path: 'patients/:id/visits', component: PatientVisitsComponent, canActivate: [AuthGuard] },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: RoleManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
