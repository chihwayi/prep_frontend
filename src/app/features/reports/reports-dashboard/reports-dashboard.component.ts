import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RetentionDTO } from '../../../models/retention-dto.model';
import { DemographicDTO } from '../../../models/demographic-dto.model';
import { InjectionTrendDTO } from '../../../models/injection-trend-dto.model';
import { MissingFollowUpDTO } from '../../../models/missing-follow-up-dto.model';

@Component({
  selector: 'app-reports-dashboard',
  standalone: false,
  
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.css'
})
export class ReportsDashboardComponent implements OnInit {
  demographicsData = new MatTableDataSource<DemographicDTO>();
  retentionData = new MatTableDataSource<RetentionDTO>();
  injectionTrendsData = new MatTableDataSource<InjectionTrendDTO>();
  missingFollowUpsData = new MatTableDataSource<MissingFollowUpDTO>();
  dateForm: FormGroup;

  demographicsColumns = ['sex', 'populationType', 'ageGroup', 'totalPatients'];
  retentionColumns = ['typeOfInjection', 'currentStatus', 'discontinuationReason', 'totalCases'];
  injectionTrendsColumns = ['month', 'totalInjections'];
  missingFollowUpsColumns = ['patientId', 'sex', 'populationType', 'lastInjectionDate', 'daysSinceLastInjection'];

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.loadData();
    this.dateForm.valueChanges.subscribe(() => {
      if (this.dateForm.valid) {
        this.loadInjectionTrends();
      }
    });
  }

  private loadData() {
    this.reportService.getPopulationDemographics().subscribe(
      data => this.demographicsData.data = data
    );
    
    this.reportService.getRetentionByInjectionType().subscribe(
      data => this.retentionData.data = data
    );
    
    this.loadInjectionTrends();
    
    this.reportService.getMissingFollowUps().subscribe(
      data => this.missingFollowUpsData.data = data
    );
  }

  private loadInjectionTrends() {
    const { startDate, endDate } = this.dateForm.value;
    if (startDate && endDate) {
      this.reportService.getInjectionTrends(startDate, endDate).subscribe(
        data => this.injectionTrendsData.data = data
      );
    }
  }
}

