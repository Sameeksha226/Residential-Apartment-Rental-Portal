import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unit-details.html',
  styleUrl: './unit-details.css',
})
export class UnitDetails implements OnInit {

  unit: any;
  amenities: string[] = [];

  startDate!: string;
  endDate!: string;

  constructor(
    private route: ActivatedRoute,
    private service: DashboardService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getUnitDetails(id).subscribe(res => {
      this.unit = res.unit;
      this.amenities = res.amenities;
    });
  }

  bookUnit() {
    this.service.bookUnit(this.unit.id, this.startDate, this.endDate)
      .subscribe({
        next: () => alert('Booking request sent to admin'),
        error: err => alert(err.error.message || 'Booking failed')
      });
  }

  requestVisit() {
    alert('Visit request submitted');
  }
}
