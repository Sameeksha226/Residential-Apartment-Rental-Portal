import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-amenities',
  imports: [FormsModule,CommonModule],
  templateUrl: './amenities.html',
  styleUrl: './amenities.css',
})
export class Amenities implements OnInit {
  amenityList: any[]= [];
  amenityForm: any = {
    id:null,
    tower_id: null,
    name: '',
    description: '',
    capacity: null,
    available:'',
    icon:'',
    image_url:''
  }

  isEdit = false;
  
  constructor(private dashboardService: DashboardService) {}

 ngOnInit(): void {
    this.loadAmenities();
 }

 loadAmenities() {
    this.dashboardService.getAmenities().subscribe({
      next: (data) => this.amenityList = data,
      error: (err) => console.error(err)
    });
 }

 saveAmenity() {
    const payload = {
      name: this.amenityForm.name?.trim(),
      description: this.amenityForm.description,
      capacity: Number(this.amenityForm.capacity),
      available: this.amenityForm.available,
      icon: this.amenityForm.icon,
      image_url: this.amenityForm.image_url
    };
    // ✅ validation
    if (
      !payload.name ||
      isNaN(payload.capacity) || payload.capacity <= 0 ||
      !payload.available
    ) {
      alert('Please fill all required fields with valid data.');
      return;
    }
    if (this.isEdit) {
      this.dashboardService.updateAmenity(this.amenityForm.id, payload).subscribe({
        next: (res) => {
          alert('Amenity updated successfully!');
          this.resetForm();
          this.loadAmenities();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.dashboardService.createAmenity(payload).subscribe({
        next: (res) => {
          alert('Amenity created successfully!');
          this.resetForm();
          this.loadAmenities();
        } ,
        error: (err) => console.error(err)
      });
    }
  }
  resetForm() {
    this.isEdit = false;
    this.amenityForm = {
      id:null,
      tower_id: null,
      name: '',
      description: '',
      capacity: null,
      available: '',
      icon:'',
      image_url:''
}
  }
  editAmenity(amenity: any) {
    this.isEdit = true;
    this.amenityForm = { ...amenity };
  }
  
  deleteAmenity(id: number) {
    if (confirm('Are you sure you want to delete this amenity?')) {
      this.dashboardService.deleteAmenity(id).subscribe({
        next: () => {
          alert('Amenity deleted successfully!');
          this.loadAmenities();
        },
        error: (err) => console.error(err)
      });
}
  }
}
