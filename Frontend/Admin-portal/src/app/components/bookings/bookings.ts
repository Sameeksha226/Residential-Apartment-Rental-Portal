import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  imports: [FormsModule,CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements OnInit{
  bookings: any[] = [];

  bookingForm: any = {
    user_id:'',
    unit_id: '',
    start_date: '',
    end_date: '',
  };

  constructor(private dashboardService: DashboardService) {}
ngOnInit(): void {
  this.loadBookings();
}
loadBookings(){
  this.dashboardService.getBookings().subscribe({
    next: (data) => this.bookings = data,
    error: (err) => console.error(err)
  });
}
// Create booking

  createBooking() {
  console.log('TOKEN BEFORE CREATE:', localStorage.getItem('token'));

  const payload = {
    user_id:Number(this.bookingForm.user_id),
    unit_id: Number(this.bookingForm.unit_id),   // ✅ convert to number
    start_date: this.bookingForm.start_date,
    end_date: this.bookingForm.end_date
  };

  console.log('BOOKING PAYLOAD:', payload);

  this.dashboardService.createBooking(payload).subscribe({
    next: () => {
      alert('Booking created');
      this.bookingForm = { user_id:'',unit_id: '', start_date: '', end_date: '' };
      this.loadBookings();
    },
    error: (err) => {
      console.error(err);
      alert(err?.error?.message || 'Booking failed');
    }
  });
}


  // Admin update booking
  updateBooking(id: number, status: string) {
    this.dashboardService.updateBooking(id, { status }).subscribe({
      next: () => {
        alert('Booking updated');
        this.loadBookings();
      }
    });
  }
}
