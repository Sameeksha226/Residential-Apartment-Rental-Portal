import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  form = {
    email: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(private auth: Authservice, private router: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);  // redirect after login
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials';
      }
    });
  }

}
