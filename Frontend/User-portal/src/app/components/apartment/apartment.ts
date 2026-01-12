import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartment.html'
})
export class Apartment implements OnInit {

  units: any[] = [];
  filteredUnits: any[] = [];

  // Filters
  searchText = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minArea: number | null = null;
  bedrooms: number | null = null;
  bathrooms: number | null = null;

  constructor(
    private service: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits() {
    this.service.getAvailableUnits().subscribe(units => {
      this.units = units;
      this.filteredUnits = [...units];
    });
  }

  applyFilters() {
    this.filteredUnits = this.units.filter(u => {

      /* 🔍 TEXT SEARCH: Unit + Tower + Location */
      if (this.searchText) {
        const t = this.searchText.toLowerCase();

        const unitMatch = u.unit_id?.toLowerCase().includes(t);
        const towerMatch = u.tower_name?.toLowerCase().includes(t);
        const locationMatch = u.tower_address?.toLowerCase().includes(t); // 👈 NEW

        if (!unitMatch && !towerMatch && !locationMatch) {
          return false;
        }
      }

      if (this.minPrice !== null && u.rent < this.minPrice) return false;
      if (this.maxPrice !== null && u.rent > this.maxPrice) return false;
      if (this.minArea !== null && u.area_sqft < this.minArea) return false;
      if (this.bedrooms !== null && u.bedrooms !== this.bedrooms) return false;
      if (this.bathrooms !== null && u.bathrooms !== this.bathrooms) return false;

      return true;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minArea = null;
    this.bedrooms = null;
    this.bathrooms = null;
    this.filteredUnits = [...this.units];
  }

  goToUnit(unit: any) {
    this.router.navigate(['/unit-details', unit.id]);
  }
}
