import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: Authservice, private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('token');   // ✅ FIX
    const expiry = localStorage.getItem('token_expiry');

    if (!token || !expiry || Date.now() > Number(expiry) * 1000) {
      console.warn('⛔ Session expired or token missing');
      this.auth.logout();
      return false;
    }

    return true;
  }
}
