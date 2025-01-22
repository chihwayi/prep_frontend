import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicsReportComponent } from './demographics-report.component';

describe('DemographicsReportComponent', () => {
  let component: DemographicsReportComponent;
  let fixture: ComponentFixture<DemographicsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemographicsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
