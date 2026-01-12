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
  messages: any[] = [];
  newMessage = '';
  editMessageId: number | null = null;
  editMessageText = '';

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.loadProfile();
    this.loadBookings();
    this.loadMessages();
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
hasPaidThisMonth(leaseId: number): boolean {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return this.payments.some(p => {
    const d = new Date(p.payment_date);
    return (
      p.lease_id === leaseId &&
      d.getMonth() === month &&
      d.getFullYear() === year
    );
  });
}

getPayableAmount(lease: any): number {
  const paymentsForLease = this.payments.filter(p => p.lease_id === lease.id);

  // First payment → Deposit + Rent
  if (paymentsForLease.length === 0) {
    return Number(lease.deposit) + Number(lease.rent_amount);
  }

  // Monthly rent
  return lease.rent_amount;
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

  loadMessages() {
  this.service.getMyMessages()
    .subscribe(res => this.messages = res);
}

sendMessageToAdmin() {
  if (!this.newMessage.trim()) return;

  this.service.sendMessageToAdmins(this.newMessage)
    .subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
}

startEdit(m: any) {
  this.editMessageId = m.id;
  this.editMessageText = m.message;
}

cancelEdit() {
  this.editMessageId = null;
  this.editMessageText = '';
}

saveEdit() {
  if (!this.editMessageId) return;

  this.service.updateMessage(this.editMessageId, this.editMessageText)
    .subscribe(() => {
      this.cancelEdit();
      this.loadMessages();
    });
}

deleteMessage(m: any) {
  if (!confirm('Delete message?')) return;

  this.service.deleteMessage(m.id)
    .subscribe(() => this.loadMessages());
}
}
