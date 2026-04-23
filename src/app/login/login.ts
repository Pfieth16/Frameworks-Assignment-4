import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  error = signal('');

  async signIn(email: string, password: string) {
    try {
      await this.authService.signIn(email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      this.error.set(this.authService.errorMessage() || 'Sign-in failed.');
    }
  }

  async signUp(email: string, password: string) {
    try {
      await this.authService.signUp(email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      this.error.set(this.authService.errorMessage() || 'Sign-up failed.');
    }
  }
}
