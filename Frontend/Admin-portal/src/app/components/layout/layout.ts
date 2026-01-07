import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
 constructor(private auth: Authservice) {}

  logout() {
    this.auth.logout();
  }
}
