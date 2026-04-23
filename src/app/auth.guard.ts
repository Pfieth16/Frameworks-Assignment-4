import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate() {
    if (this.authService.currentUser()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
