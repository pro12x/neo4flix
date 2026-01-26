import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { User } from '../../models/auth.model';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="profile-container">
      <header class="landing-header">
        <div class="logo" routerLink="/">NEO4FLIX</div>
        <button class="btn-logout" (click)="logout()">Logout</button>
      </header>
      <div class="profile-content">
        <h1>Profile</h1>
        <div *ngIf="user" class="user-info">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
          <p><strong>Pseudo:</strong> {{ user.pseudo }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>2FA Enabled:</strong> {{ user.twoFactorEnabled ? 'Yes' : 'No' }}</p>
        </div>

        <!-- 2FA Setup Section -->
        <div class="two-fa-section" *ngIf="!user?.twoFactorEnabled">
          <h2>Enable Two-Factor Authentication</h2>
          <button class="btn-setup" (click)="onSetup2Fa()" [disabled]="loading">Setup 2FA</button>
          <div *ngIf="setupSecret" class="setup-details">
            <p><strong>Secret:</strong> {{ setupSecret }}</p>
            <div *ngIf="setupOtpauthUri">
              <p>Scan this QR code with Google Authenticator or Authy:</p>
              <img [src]="qrImageUrl" alt="2FA QR Code" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Enter code from app" [(ngModel)]="setupCode" />
            </div>
            <button class="btn-enable" (click)="onEnable2Fa()" [disabled]="!setupCode || loading">Enable 2FA</button>
          </div>
          <div *ngIf="setupError" class="error">{{ setupError }}</div>
          <div *ngIf="setupSuccess" class="success">2FA enabled successfully!</div>
        </div>

        <!-- Disable 2FA -->
        <div class="two-fa-section" *ngIf="user?.twoFactorEnabled">
          <h2>Two-Factor Authentication</h2>
          <p>2FA is currently enabled for your account.</p>
          <button class="btn-disable" (click)="onDisable2Fa()" [disabled]="loading">Disable 2FA</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background-color: #141414;
      color: white;
    }
    .landing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 3rem;
    }
    .logo {
      font-size: 2.5rem;
      font-weight: 700;
      color: #e50914;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-logout {
      background: none;
      color: white;
      border: 1px solid white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .profile-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .user-info {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .two-fa-section {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 8px;
    }
    .btn-setup, .btn-enable, .btn-disable {
      background: #e50914;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin: 0.5rem 0;
    }
    .btn-disable {
      background: #666;
    }
    .setup-details {
      margin-top: 1rem;
    }
    .form-group {
      margin: 1rem 0;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      background: #333;
      color: white;
    }
    img {
      max-width: 200px;
      height: auto;
    }
    .error {
      color: #e50914;
      margin-top: 0.5rem;
    }
    .success {
      color: lightgreen;
      margin-top: 0.5rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;

  // 2FA setup
  setupSecret = '';
  setupOtpauthUri = '';
  setupCode = '';
  setupError = '';
  setupSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onSetup2Fa(): void {
    if (!this.user?.email) return;
    this.loading = true;
    this.setupError = '';
    this.setupSuccess = false;
    this.authService.setupTwoFactor(this.user.email).subscribe({
      next: (res) => {
        this.setupSecret = res?.secret || '';
        this.setupOtpauthUri = res?.otpauth_uri || '';
        this.loading = false;
      },
      error: (err) => {
        this.setupError = err.error?.message || 'Could not start 2FA setup.';
        this.loading = false;
      }
    });
  }

  get qrImageUrl(): string {
    try {
      return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(this.setupOtpauthUri);
    } catch (e) {
      return '';
    }
  }

  onEnable2Fa(): void {
    if (!this.setupCode || !this.user?.email) return;
    const code = Number(this.setupCode);
    if (isNaN(code) || code < 100000 || code > 999999) {
      this.setupError = 'Please enter a valid 6-digit code.';
      return;
    }
    this.loading = true;
    this.setupError = '';
    this.authService.enableTwoFactor(this.user.email, code).subscribe({
      next: (res) => {
        this.setupSuccess = true;
        this.setupError = '';
        this.loading = false;
        // Update user locally
        if (this.user) {
          this.user.twoFactorEnabled = true;
        }
      },
      error: (err) => {
        this.setupError = err.error?.message || 'Failed to enable 2FA.';
        this.loading = false;
      }
    });
  }

  onDisable2Fa(): void {
    if (!this.user?.email) return;
    this.loading = true;
    // Note: We need to add disable method to AuthService
    // For now, assume it's added
    this.authService.disableTwoFactor(this.user.email).subscribe({
      next: (res) => {
        this.loading = false;
        // Update user locally
        if (this.user) {
          this.user.twoFactorEnabled = false;
        }
      },
      error: (err) => {
        this.setupError = err.error?.message || 'Failed to disable 2FA.';
        this.loading = false;
      }
    });
  }
}
