import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-users',
  imports: [FormsModule,CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users: any[] = [];

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

  ngOnInit(): void {
    this.loadUsers();
  }

  /* ---------------- LOAD USERS ---------------- */

  loadUsers() {
    this.service.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  /* ---------------- FORM CONTROLS ---------------- */

  openAddForm() {
    this.resetForm();
    this.showForm = true;
    this.editMode = false;
  }

  editUser(user: any) {
    this.showForm = true;
    this.editMode = true;
    this.selectedUserId = user.id;

    this.form = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role
    };
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

  /* ---------------- SAVE USER ---------------- */

  saveUser() {
    if (this.editMode && this.selectedUserId) {
      this.service.updateUser(this.selectedUserId, this.form).subscribe(() => {
        this.loadUsers();
        this.cancelForm();
      });
    } else {
      this.service.createUser(this.form).subscribe(() => {
        this.loadUsers();
        this.cancelForm();
      });
    }
  }

  /* ---------------- DELETE USER ---------------- */

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
