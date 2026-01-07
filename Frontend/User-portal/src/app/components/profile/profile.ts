import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  activeTab: 'bookings' | 'payments' | 'leases' = 'bookings';

  user: any;
  bookings: any[] = [];
  leases: any[] = [];
  payments: any[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.loadProfile();
    this.loadBookings();
  }

  setTab(tab: any) {
    this.activeTab = tab;

    if (tab === 'bookings') this.loadBookings();
    if (tab === 'leases') this.loadLeases();
    if (tab === 'payments') this.loadPayments();
  }

  paymentMethod = '';

hasPaid(leaseId: number): boolean {
  return this.payments.some(p => p.lease_id === leaseId);
}

payNow(lease: any) {
  if (!this.paymentMethod) {
    alert('Select payment method');
    return;
  }

  const payload = {
    lease_id: lease.id,
    amount: lease.rent_amount,
    payment_method: this.paymentMethod
  };

  this.service.createPayment(payload).subscribe({
    next: () => {
      alert('Payment successful');
      this.paymentMethod = '';
      this.loadPayments();
    },
    error: err => {
      alert(err.error?.message || 'Payment failed');
    }
  });
}


  loadProfile() {
    this.service.getProfile().subscribe(res => this.user = res);
  }

  loadBookings() {
    this.service.getBookings().subscribe(res => this.bookings = res);
  }

  loadLeases() {
    this.service.getLeases().subscribe(res => this.leases = res);
  }

  loadPayments() {
    this.service.getPayments().subscribe(res => this.payments = res);
  }
}
