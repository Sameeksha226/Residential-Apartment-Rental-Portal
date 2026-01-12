import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  imports: [FormsModule, CommonModule],
  templateUrl: './bookings.html',
})
export class Bookings implements OnInit {

  bookings: any[] = [];

  isEditMode = false;
  editingBookingId: number | null = null;

  showLeaseForm = false;
  selectedBookingForLease: any = null;
  leaseDeposit: number | null = null;

  bookingForm: any = {
    user_id: '',
    unit_id: '',
    start_date: '',
    end_date: ''
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.dashboardService.getBookings().subscribe(data => {
      this.bookings = data;
    });
  }

  createBooking() {
    this.dashboardService.createBooking(this.bookingForm).subscribe(() => {
      alert('Booking created');
      this.resetForm();
      this.loadBookings();
    }, error => {
      alert(error.error.message);
    }
  );
  }

  editBooking(b: any) {
    this.isEditMode = true;
    this.editingBookingId = b.id;
    this.bookingForm = { ...b };
  }

  submitUpdate() {
    this.dashboardService.updateBooking(this.editingBookingId!, this.bookingForm)
      .subscribe(() => {
        alert('Booking updated');
        this.resetForm();
        this.loadBookings();
      });
  }

  approveBooking(booking: any) {
    this.dashboardService.updateBooking(booking.id, { status: 'approved' })
      .subscribe(() => {
        if (confirm('Create lease for this booking?')) {
          this.showLeaseForm = true;
          this.selectedBookingForLease = booking;
        }
        this.loadBookings();
      });
  }

  createLease() {
  if (!this.selectedBookingForLease) return;

  const payload = {
    booking_id: this.selectedBookingForLease.id,
    user_id: this.selectedBookingForLease.user_id,
    unit_id: this.selectedBookingForLease.unit_id,
    start_date: this.selectedBookingForLease.start_date,
    end_date: this.selectedBookingForLease.end_date,
    rent_amount: this.selectedBookingForLease.unit?.rent, // IMPORTANT
    deposit: this.leaseDeposit
  };

  console.log('LEASE PAYLOAD:', payload);

  this.dashboardService.createLease(payload).subscribe({
    next: () => {
      alert('Lease created successfully');
      this.cancelLease();
      this.loadBookings();
    },
    error: (err) => {
      console.error(err);
      alert(err?.error?.message || 'Lease creation failed');
    }
  });
}


  cancelLease() {
    this.showLeaseForm = false;
    this.selectedBookingForLease = null;
    this.leaseDeposit = null;
  }

  updateBookingStatus(id: number, status: string) {
    this.dashboardService.updateBooking(id, { status }).subscribe(() => {
      this.loadBookings();
    });
  }

  deleteBooking(id: number) {
    if (!confirm('Delete booking?')) return;
    this.dashboardService.deleteBooking(id).subscribe(() => {
      this.loadBookings();
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.isEditMode = false;
    this.editingBookingId = null;
    this.bookingForm = {
      user_id: '',
      unit_id: '',
      start_date: '',
      end_date: ''
    };
  }
}
