import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leases',
  imports: [FormsModule,CommonModule],
  templateUrl: './leases.html',
  styleUrl: './leases.css',
})
export class Leases {
 leaseList: any[] = [];
  paymentsMap: { [key: number]: any[] } = {};
  expandedLeaseId: number | null = null;
  editLease: any = null;

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.loadLeases();
  }

  loadLeases() {
    this.service.getLeases().subscribe(res => {
      this.leaseList = res;
    });
  }

  updateLease(lease: any) {
    this.service.updateLease(lease.id, lease).subscribe(() => {
      alert('Lease updated');
    });
  }

  deleteLease(id: number) {
    if (!confirm('Delete this lease?')) return;
    this.service.deleteLease(id).subscribe(() => {
      this.loadLeases();
    });
  }


openEdit(lease: any) {
  this.editLease = { ...lease }; // clone to avoid instant update
}

saveLease() {
  this.service.updateLease(this.editLease.id, this.editLease)
    .subscribe(() => {
      this.editLease = null;
      this.loadLeases();
    });
}

togglePayments(id: number) {
  if (this.expandedLeaseId === id) {
    this.expandedLeaseId = null;
    return;
  }

  this.expandedLeaseId = id;

  if (!this.paymentsMap[id]) {
    this.service.getPaymentsByLease(id).subscribe(res => {
      this.paymentsMap[id] = res;
    });
  }
}

}
