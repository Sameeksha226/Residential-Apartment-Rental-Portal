import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './units.html'
})
export class Units implements OnInit {

  unitList: any[] = [];
  towerList: any[] = [];
  selectedOccupant: any = null;
  showOccupantModal = false;


  unitForm: any = {
    id: null,
    tower_id: null,
    unit_id: '',
    floor: null,
    bedrooms: null,
    bathrooms: null,
    area_sqft: null,
    rent: null,
    status: 'available',
    description: '',
    image_url: ''
  };

  isEdit = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadUnits();
    this.loadTowers();
  }

  loadUnits() {
    this.dashboardService.getUnitById().subscribe({
      next: (data) => this.unitList = data,
      error: (err) => console.error(err)
    });
  }

  loadTowers() {
  this.dashboardService.getTowers().subscribe(res => {
    this.towerList = res;
  });
}

  saveUnit() {
    const payload = {
      tower_id: Number(this.unitForm.tower_id),
      unit_id: this.unitForm.unit_id?.trim(),
      floor: Number(this.unitForm.floor),
      bedrooms: Number(this.unitForm.bedrooms),
      bathrooms: Number(this.unitForm.bathrooms),
      area_sqft: Number(this.unitForm.area_sqft),
      rent: Number(this.unitForm.rent),
      status: this.unitForm.status,
      description: this.unitForm.description,
      image_url: this.unitForm.image_url
    };

    // ✅ validation
    if (
      !payload.tower_id ||
      !payload.unit_id ||
      isNaN(payload.floor) ||
      isNaN(payload.bedrooms) ||
      isNaN(payload.bathrooms) ||
      isNaN(payload.area_sqft) ||
      isNaN(payload.rent)
    ) {
      alert('All required fields must be filled');
      return;
    }

    if (this.isEdit) {
      this.dashboardService.updateUnit(this.unitForm.id, payload).subscribe({
        next: () => {
          alert('Unit updated');
          this.resetForm();
          this.loadUnits();
        }
      });
    } else {
      this.dashboardService.createUnit(payload).subscribe({
        next: () => {
          alert('Unit created');
          this.resetForm();
          this.loadUnits();
        }
      });
    }
  }

  editUnit(unit: any) {
    this.isEdit = true;
    this.unitForm = { ...unit };
  }

  deleteUnit(id: number) {
    if (!confirm('Delete this unit?')) return;

    this.dashboardService.deleteUnit(id).subscribe({
      next: () => {
        alert('Unit deleted');
        this.loadUnits();
      }
    });
  }

  viewOccupant(unit: any) {

  if (unit.status !== 'occupied') {
    alert('Unit is not occupied');
    return;
  }

  this.dashboardService.getUnitOccupant(unit.id).subscribe({
    next: res => {
      this.selectedOccupant = res;
      this.showOccupantModal = true;
    },
    error: err => {
      alert(err.error?.message || 'No occupant data found');
    }
  });
}

  resetForm() {
    this.isEdit = false;
    this.unitForm = {
      id: null,
      tower_id: null,
      unit_id: '',
      floor: null,
      bedrooms: null,
      bathrooms: null,
      area_sqft: null,
      rent: null,
      status: 'available',
      description: '',
      image_url: ''
    };
  }
}
