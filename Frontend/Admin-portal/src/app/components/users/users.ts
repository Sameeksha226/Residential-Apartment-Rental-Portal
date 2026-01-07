import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-users',
  imports: [FormsModule, CommonModule],
  templateUrl: './users.html',
})
export class Users {

  users: any[] = [];

  selectedUser: any = null;
  userBookings: any[] = [];
  userLeases: any[] = [];
  userPayments: any[] = [];

  showForm = false;
  editMode = false;
  selectedUserId: number | null = null;

  form = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  };

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getUsers().subscribe(res => this.users = res);
  }

  selectUser(user: any) {
    this.selectedUser = user;

    this.service.getUserBookings(user.id)
      .subscribe(res => this.userBookings = res);

    this.service.getUserLeases(user.id)
      .subscribe(res => this.userLeases = res);

    this.service.getUserPayments(user.id)
      .subscribe(res => this.userPayments = res);
  }

  openAddForm() {
    this.resetForm();
    this.showForm = true;
    this.editMode = false;
  }

  editUser(user: any) {
    this.showForm = true;
    this.editMode = true;
    this.selectedUserId = user.id;
    this.form = { ...user, password: '' };
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.form = {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user'
    };
    this.selectedUserId = null;
  }

  saveUser() {
    if (this.editMode && this.selectedUserId) {
      this.service.updateUser(this.selectedUserId, this.form)
        .subscribe(() => {
          this.loadUsers();
          this.cancelForm();
        });
    } else {
      this.service.createUser(this.form)
        .subscribe(() => {
          this.loadUsers();
          this.cancelForm();
        });
    }
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      this.service.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
