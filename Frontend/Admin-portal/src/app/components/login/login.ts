import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, FormsModule, CommonModule],
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
      next: (res: any) => {
        this.loading = false;

        // ✅ STORE TOKEN EXPIRY (ADDED)
        const token = res.access_token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('token_expiry', payload.exp.toString());

        // ✅ START SESSION TIMER
        this.auth.startSessionTimer();

        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials';
      }
    });
  }
}
