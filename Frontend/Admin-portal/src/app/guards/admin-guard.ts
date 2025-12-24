import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: Authservice, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
