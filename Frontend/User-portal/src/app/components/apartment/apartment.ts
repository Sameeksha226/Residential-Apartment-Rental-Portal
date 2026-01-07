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

  towers: any[] = [];
  units: any[] = [];
  filteredUnits: any[] = [];

  towerMap: { [key: number]: string } = {};

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
    this.loadTowersAndUnits();
  }

  loadTowersAndUnits() {
    this.service.getTowers().subscribe(towers => {
      this.towers = towers;

      towers.forEach((t: any) => {
        this.towerMap[t.id] = t.name;
      });

      this.service.getAvailableUnits().subscribe(units => {
        this.units = units.map((u: any) => ({
          ...u,
          tower_name: this.towerMap[u.tower_id] ?? 'Unknown Tower'
        }));

        this.filteredUnits = [...this.units];
      });
    });
  }

  applyFilters() {
    this.filteredUnits = this.units.filter(u => {

      if (this.searchText) {
        const t = this.searchText.toLowerCase();
        if (
          !u.unit_id.toLowerCase().includes(t) &&
          !u.tower_name.toLowerCase().includes(t)
        ) return false;
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
    this.applyFilters();
  }

  goToUnit(unit: any) {
    this.router.navigate(['/unit-details', unit.id]);
  }
}
