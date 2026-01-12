import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.html'
})
export class AdminReports {

  bookingReport: any[] = [];
  revenueReport: any[] = [];
  userReport: any[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.service.getBookingReport().subscribe(res => this.bookingReport = res);
    this.service.getRevenueReport().subscribe(res => this.revenueReport = res);
    this.service.getUserReport().subscribe(res => this.userReport = res);
  }

  downloadCSV() {
    this.service.downloadAllReportsCSV().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'admin-reports.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
