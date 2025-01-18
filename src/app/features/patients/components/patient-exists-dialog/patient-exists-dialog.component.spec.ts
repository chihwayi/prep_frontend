import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientExistsDialogComponent } from './patient-exists-dialog.component';

describe('PatientExistsDialogComponent', () => {
  let component: PatientExistsDialogComponent;
  let fixture: ComponentFixture<PatientExistsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientExistsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientExistsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
