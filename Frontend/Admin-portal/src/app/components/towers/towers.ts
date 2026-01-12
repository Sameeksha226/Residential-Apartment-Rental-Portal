import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-towers',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './towers.html',
  styleUrl: './towers.css'
})
export class Towers implements OnInit {

  towerList: any[] = [];
  selectedTower: any = null;
  unitList: any[] = []; 

  towerForm: any = {
    id: null,
    name: '',
    address: '',
    total_floors: null
  };

  isEdit = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadTowers();
  }

  // Load towers
  loadTowers() {
    this.dashboardService.getTowers().subscribe({
      next: (data) => this.towerList = data,
      error: (err) => console.error(err)
    });
  }

  // Save (Create / Update)
  saveTower() {
  const payload = {
    name: this.towerForm.name?.trim(),
    address: this.towerForm.address?.trim(),
    total_floors: Number(this.towerForm.total_floors)
  };

  // ✅ Correct validation
  if (
    !payload.name ||
    !payload.address ||
    payload.total_floors === null ||
    isNaN(payload.total_floors)
  ) {
    alert('All fields are required');
    return;
  }

  if (this.isEdit) {
    this.dashboardService.updateTower(this.towerForm.id, payload).subscribe({
      next: () => {
        alert('Tower updated');
        this.resetForm();
        this.loadTowers();
      }
    });
  } else {
    this.dashboardService.createTower(payload).subscribe({
      next: () => {
        alert('Tower created');
        this.resetForm();
        this.loadTowers();
      }
    });
  }
}


  // Edit button click
  editTower(tower: any) {
    this.isEdit = true;
    this.towerForm = { ...tower };
  }

  // Delete tower
  deleteTower(id: number) {
    if (!confirm('Delete this tower?')) return;

    this.dashboardService.deleteTower(id).subscribe({
      next: () => {
        alert('Tower deleted');
        this.loadTowers();
      }
    });
  }

  viewUnits(tower: any) {
  if (this.selectedTower?.id === tower.id) {
    this.selectedTower = null;
    this.unitList = [];
    return;
  }

  this.selectedTower = tower;

  this.dashboardService
    .getUnitsByTower(tower.id)
    .subscribe(res => {
      this.unitList = res;
    });
}

  // Reset form
  resetForm() {
    this.isEdit = false;
    this.towerForm = {
      id: null,
      name: '',
      address: '',
      total_floors: null
    };
  }
}
