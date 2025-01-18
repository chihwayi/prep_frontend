import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientVisitsComponent } from './components/patient-visits/patient-visits.component';

const routes: Routes = [
  { path: 'patients/:id/visits', component: PatientVisitsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitsRoutingModule { }
