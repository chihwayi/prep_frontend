import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitConfirmDialogComponent } from './visit-confirm-dialog.component';

describe('VisitConfirmDialogComponent', () => {
  let component: VisitConfirmDialogComponent;
  let fixture: ComponentFixture<VisitConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
