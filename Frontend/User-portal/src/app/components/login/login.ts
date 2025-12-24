import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
loginObj = {
    email: '',
    password: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert('Email and password required');
      return;
    }

    this.auth.login(this.loginObj).subscribe({
      next: () => {
        this.router.navigate(['/home']); // or home
      },
      error: (err) => {
        alert(err.error?.message || 'Invalid credentials');
      }
    });
  }

}
