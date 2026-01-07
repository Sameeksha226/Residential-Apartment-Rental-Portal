import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Authservice } from './services/authservice';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Admin-portal');

  constructor(private auth:Authservice) {}

  ngOnInit() {
     if (this.auth.getToken() && !this.auth.isTokenExpired()) {
      this.auth.startSessionTimer(); // 🔥 CRITICAL
    }
  }
}
