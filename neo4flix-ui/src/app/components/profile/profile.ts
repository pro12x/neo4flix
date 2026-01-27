import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth';
import { User } from '../../models/auth.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="profile-container">
      <!-- Animated Background -->
      <div class="background-video">
        <div class="video-overlay"></div>
        <div class="particles-container">
          <div class="particle" *ngFor="let _ of particles"></div>
        </div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <!-- Header -->
      <header class="profile-header">
        <div class="logo" routerLink="/">
          <span class="logo-text">NEO4FLIX</span>
          <div class="logo-glow"></div>
        </div>
        <button class="btn-logout" (click)="logout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </header>

      <!-- Main Profile Content -->
      <main class="profile-main">
        <div class="profile-hero">
          <div class="hero-background">
            <div class="hero-gradient"></div>
            <div class="hero-pattern"></div>
          </div>

          <div class="hero-content">
            <div class="avatar-section">
              <div class="avatar-container">
                <div class="avatar">
                  <span class="avatar-text">{{ getInitials(user?.firstName, user?.lastName) }}</span>
                  <div class="avatar-glow"></div>
                </div>
                <div class="avatar-decoration">
                  <div class="decoration-ring"></div>
                  <div class="decoration-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div>
                </div>
              </div>

              <div class="welcome-section">
                <h1 class="welcome-title">
                  <span class="welcome-text">Welcome back,</span>
                  <span class="user-name">{{ user?.firstName }}</span>
                </h1>
                <p class="welcome-subtitle">Ready to discover your next favorite movie?</p>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="stats-section">
              <div class="stat-card">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="23,7 16,12 23,17 23,7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ user?.firstName?.length || 0 }}</div>
                  <div class="stat-label">Movies Watched</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ user?.lastName?.length || 0 }}</div>
                  <div class="stat-label">In Watchlist</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ user?.email?.length || 0 }}</div>
                  <div class="stat-label">Reviews Given</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Cards Grid -->
        <div class="profile-grid">
          <!-- User Info Card -->
          <div class="profile-card user-info-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h2>Profile Information</h2>
            </div>
            <div class="card-content">
              <div class="info-row">
                <div class="info-item">
                  <span class="label">Email Address</span>
                  <span class="value">{{ user?.email }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">Full Name</span>
                  <span class="value">{{ user?.firstName }} {{ user?.lastName }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">Username</span>
                  <span class="value">{{ user?.pseudo }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">Member Since</span>
                  <span class="value">{{ getMemberSince() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="profile-card actions-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13,2 13,9 20,9"/>
                </svg>
              </div>
              <h2>Quick Actions</h2>
            </div>
            <div class="card-content">
              <div class="action-buttons">
                <a routerLink="/recommendations" class="action-btn">
                  <div class="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                    </svg>
                  </div>
                  <span>Get Recommendations</span>
                </a>

                <a routerLink="/ratings" class="action-btn">
                  <div class="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  </div>
                  <span>My Ratings</span>
                </a>

                <a routerLink="/watchlist" class="action-btn">
                  <div class="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <span>Watchlist</span>
                </a>

                <a routerLink="/search" class="action-btn">
                  <div class="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <span>Search Movies</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Account Settings Card -->
          <div class="profile-card settings-card">
            <div class="card-header">
              <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h2>Account Settings</h2>
            </div>
            <div class="card-content">
              <div class="settings-options">
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">Two-Factor Authentication</div>
                    <div class="setting-description">Add an extra layer of security</div>
                  </div>
                  <div class="setting-status">
                    <button
                      class="toggle-2fa-btn"
                      [class.enabled]="twoFactorEnabled()"
                      [disabled]="twoFactorBusy()"
                      (click)="toggleTwoFactor(!twoFactorEnabled())">
                      <svg *ngIf="!twoFactorEnabled()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <svg *ngIf="twoFactorEnabled()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                      </svg>
                      {{ twoFactorEnabled() ? 'Disable 2FA' : 'Enable 2FA' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2FA Setup Modal -->
        <div class="modal-overlay" *ngIf="showTwoFactorSetup()">
          <div class="modal">
            <h3>Enable Two-Factor Authentication</h3>
            <p>Scan the QR code below with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator) and enter the 6-digit code to verify.</p>
            <div class="qr-container" *ngIf="otpauthUri">
              <img [src]="qrImageUrl()" alt="QR Code" />
            </div>
            <div class="manual-setup" *ngIf="secret">
              <p><strong>Can't scan the QR code?</strong></p>
              <p>Enter this secret manually in your app:</p>
              <code>{{ secret() }}</code>
            </div>
            <div class="form-row">
              <label>Verification Code</label>
              <input type="text" [(ngModel)]="verificationCode" placeholder="123456" maxlength="6" />
            </div>
            <div class="modal-actions">
              <button (click)="confirmEnable()" [disabled]="twoFactorBusy()">{{ twoFactorBusy() ? 'Verifying...' : 'Verify & Enable' }}</button>
              <button class="cancel" (click)="cancelSetup()">Cancel</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow-x: hidden;
      background: #000000;
    }

    .profile-container {
      position: relative;
      min-height: 100vh;
      background: #000000;
    }

    /* Animated Background */
    .background-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(20, 20, 40, 0.8) 50%,
        rgba(0, 0, 0, 0.9) 100%
      );
      backdrop-filter: blur(3px);
    }

    /* Particles Animation */
    .particles-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 50%;
      animation: float 30s infinite linear;
    }

    .particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 3s; }
    .particle:nth-child(3) { width: 3px; height: 3px; left: 30%; animation-delay: 6s; }
    .particle:nth-child(4) { width: 5px; height: 5px; left: 40%; animation-delay: 9s; }
    .particle:nth-child(5) { width: 4px; height: 4px; left: 50%; animation-delay: 12s; }
    .particle:nth-child(6) { width: 7px; height: 7px; left: 60%; animation-delay: 15s; }
    .particle:nth-child(7) { width: 3px; height: 3px; left: 70%; animation-delay: 18s; }
    .particle:nth-child(8) { width: 5px; height: 5px; left: 80%; animation-delay: 21s; }
    .particle:nth-child(9) { width: 4px; height: 4px; left: 90%; animation-delay: 24s; }
    .particle:nth-child(10) { width: 6px; height: 6px; left: 95%; animation-delay: 27s; }

    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.5;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    /* Floating Shapes */
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      background: linear-gradient(45deg, rgba(229, 9, 20, 0.06), rgba(178, 7, 16, 0.06));
      border: 1px solid rgba(229, 9, 20, 0.12);
      animation: shapeFloat 35s infinite linear;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 20%;
      right: 5%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 70px;
      height: 70px;
      border-radius: 20px;
      top: 60%;
      left: 15%;
      animation-delay: 12s;
    }

    .shape-3 {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      top: 40%;
      right: 20%;
      animation-delay: 24s;
    }

    @keyframes shapeFloat {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.3;
      }
      25% {
        transform: translateY(-25px) rotate(90deg) scale(1.1);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-50px) rotate(180deg) scale(0.9);
        opacity: 0.4;
      }
      75% {
        transform: translateY(-25px) rotate(270deg) scale(1.05);
        opacity: 0.5;
      }
      100% {
        transform: translateY(0px) rotate(360deg) scale(1);
        opacity: 0.3;
      }
    }

    /* Header */
    .profile-header {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 4rem;
      animation: headerSlideIn 1s ease-out;
    }

    @keyframes headerSlideIn {
      from {
        transform: translateY(-100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .logo {
      position: relative;
      font-size: 2.2rem;
      font-weight: 700;
      color: #e50914;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo-text {
      background: linear-gradient(45deg, #e50914, #b20710);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 2;
    }

    .logo-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #e50914, #b20710);
      border-radius: 8px;
      opacity: 0;
      z-index: 1;
      transition: opacity 0.3s ease;
      filter: blur(8px);
    }

    .logo:hover .logo-glow {
      opacity: 0.3;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(229, 9, 20, 0.3);
    }

    .btn-logout:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
    }

    /* Main Content */
    .profile-main {
      position: relative;
      z-index: 5;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Hero Section */
    .profile-hero {
      position: relative;
      margin-bottom: 4rem;
      animation: heroFadeIn 1.5s ease-out 0.3s both;
    }

    @keyframes heroFadeIn {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      overflow: hidden;
      z-index: 1;
    }

    .hero-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(229, 9, 20, 0.1) 0%,
        rgba(20, 20, 40, 0.8) 50%,
        rgba(0, 0, 0, 0.9) 100%
      );
      backdrop-filter: blur(2px);
    }

    .hero-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.05;
      background-image:
        radial-gradient(circle at 25% 25%, #e50914 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, #b20710 1px, transparent 1px);
      background-size: 50px 50px, 30px 30px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 4rem 3rem;
      color: #ffffff;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .avatar-container {
      position: relative;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e50914, #b20710);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: #ffffff;
      position: relative;
      z-index: 2;
      box-shadow: 0 8px 32px rgba(229, 9, 20, 0.3);
      transition: all 0.3s ease;
    }

    .avatar:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(229, 9, 20, 0.4);
    }

    .avatar-glow {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: linear-gradient(45deg, #e50914, #b20710);
      opacity: 0.3;
      z-index: 1;
      filter: blur(12px);
    }

    .avatar-decoration {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      pointer-events: none;
    }

    .decoration-ring {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid rgba(229, 9, 20, 0.3);
      border-radius: 50%;
      animation: ringPulse 3s infinite;
    }

    @keyframes ringPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.5;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }

    .decoration-dots {
      position: absolute;
      top: -5px;
      right: -5px;
      display: flex;
      gap: 3px;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: #e50914;
      border-radius: 50%;
      animation: dotGlow 2s infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.5s; }
    .dot:nth-child(3) { animation-delay: 1s; }

    @keyframes dotGlow {
      0%, 100% {
        opacity: 0.5;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    .welcome-section {
      flex: 1;
      min-width: 300px;
    }

    .welcome-title {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    .welcome-text {
      display: block;
      color: rgba(255, 255, 255, 0.8);
    }

    .user-name {
      display: block;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: nameGlow 3s ease-in-out infinite alternate;
    }

    @keyframes nameGlow {
      from {
        filter: brightness(1);
      }
      to {
        filter: brightness(1.2);
      }
    }

    .welcome-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.1rem;
      margin: 0;
    }

    /* Stats Section */
    .stats-section {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      min-width: 180px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(229, 9, 20, 0.2);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e50914, #b20710);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 0.25rem;
    }

    /* Profile Grid */
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      animation: gridFadeIn 1s ease-out 0.6s both;
    }

    @keyframes gridFadeIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .profile-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .profile-card:hover {
      transform: translateY(-5px);
      border-color: rgba(229, 9, 20, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 2rem 2rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e50914, #b20710);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .card-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
    }

    .card-content {
      padding: 2rem;
    }

    /* User Info Card */
    .info-row {
      margin-bottom: 1.5rem;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 1.1rem;
      color: #ffffff;
      font-weight: 500;
    }

    /* Actions Card */
    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      text-decoration: none;
      color: #ffffff;
      transition: all 0.3s ease;
      text-align: center;
    }

    .action-btn:hover {
      background: rgba(229, 9, 20, 0.1);
      border-color: #e50914;
      transform: translateY(-3px);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e50914, #b20710);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .action-btn span {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Settings Card */
    .settings-options {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info {
      flex: 1;
    }

    .setting-name {
      font-size: 1rem;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 0.25rem;
    }

    .setting-description {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.enabled {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .status-badge:not(.enabled) {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .setting-toggle {
      position: relative;
    }

    .toggle-switch {
      width: 44px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .toggle-switch.active {
      background: linear-gradient(135deg, #e50914, #b20710);
    }

    .toggle-slider {
      width: 18px;
      height: 18px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 3px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch.active .toggle-slider {
      left: 23px;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      background: #1e1e2e;
      border-radius: 12px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: modalFadeIn 0.3s ease-out;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1rem;
    }

    .modal p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .qr-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .qr-container img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .form-row {
      margin-bottom: 1rem;
    }

    .form-row label {
      display: block;
      color: #ffffff;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .form-row input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-row input:focus {
      border-color: #e50914;
      outline: none;
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .modal-actions button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .modal-actions button:disabled {
      background: rgba(229, 9, 20, 0.3);
      cursor: not-allowed;
    }

    .modal-actions button:not(.cancel) {
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .modal-actions button:not(.cancel):hover:not(:disabled) {
      background: linear-gradient(135deg, #b20710, #e50914);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
    }

    .modal-actions .cancel {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .modal-actions .cancel:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Manual Setup Section */
    .manual-setup {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .manual-setup p {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .manual-setup code {
      display: block;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.5rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.8rem;
      color: #ffffff;
      word-break: break-all;
      margin-top: 0.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .profile-header {
        padding: 1.5rem 2rem;
      }

      .logo {
        font-size: 1.8rem;
      }

      .btn-logout {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }

      .profile-main {
        padding: 1rem;
      }

      .hero-content {
        padding: 3rem 2rem;
      }

      .avatar-section {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .avatar {
        width: 100px;
        height: 100px;
        font-size: 2.5rem;
      }

      .welcome-title {
        font-size: 2.5rem;
      }

      .stats-section {
        justify-content: center;
      }

      .stat-card {
        min-width: 140px;
      }

      .card-header {
        padding: 1.5rem 1.5rem 1rem;
      }

      .card-content {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .profile-header {
        padding: 1rem;
      }

      .hero-content {
        padding: 2rem 1rem;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .stats-section {
        flex-direction: column;
        align-items: center;
      }

      .stat-card {
        width: 100%;
        max-width: 300px;
      }
    }

    .toggle-2fa-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
    }

    .toggle-2fa-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
      background: linear-gradient(135deg, #b20710, #e50914);
    }

    .toggle-2fa-btn.enabled {
      background: linear-gradient(135deg, #22c55e, #16a34a);
    }

    .toggle-2fa-btn.enabled:hover:not(:disabled) {
      background: linear-gradient(135deg, #16a34a, #22c55e);
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
    }

    .toggle-2fa-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // 2FA state
  twoFactorEnabled = signal<boolean>(false);
  twoFactorBusy = signal<boolean>(false);
  showTwoFactorSetup = signal<boolean>(false);
  otpauthUri = signal<string | null>(null);
  secret = signal<string | null>(null);
  verificationCode = '';

  user: User | null = null;
  particles: number[] = new Array(10).fill(0);

  constructor() {
    this.particles = new Array(10).fill(0);
  }

  ngOnInit(): void {
    this.particles = new Array(10).fill(0);
    const u = this.auth.currentUserValue;
    this.user = u;
    this.twoFactorEnabled.set(!!u?.twoFactorEnabled);
  }

  getInitials(firstName: string = '', lastName: string = ''): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getMemberSince(): string {
    // Mock data - in real app, this would come from user registration date
    return 'January 2024';
  }

  logout() {
    this.auth.logout();
  }

  toggleTwoFactor(checked: boolean) {
    if (!this.user) {
      this.toastService.show('You must be logged in to change this setting.', 'error');
      return;
    }

    if (checked) {
      // Start setup flow
      this.startSetup();
    } else {
      // Disable 2FA
      this.twoFactorBusy.set(true);
      this.auth.disableTwoFactor(this.user.email).subscribe({
        next: () => {
          this.toastService.show('Two-Factor Authentication disabled.', 'success');
          this.twoFactorEnabled.set(false);
          this.auth.updateCurrentUser({ twoFactorEnabled: false });
          this.twoFactorBusy.set(false);
        },
        error: err => {
          this.toastService.show(err?.error?.message || 'Failed to disable 2FA', 'error');
          this.twoFactorBusy.set(false);
        }
      });
    }
  }

  startSetup() {
    if (!this.user) return;
    this.twoFactorBusy.set(true);
    this.auth.setupTwoFactor(this.user.email).subscribe({
      next: res => {
        // Expecting res to contain an otpauthUri or qr data
        const uri = res?.otpauth_uri || res?.otpauthUri || res?.uri || null;
        const sec = res?.secret || res?.sharedSecret || null;
        this.otpauthUri.set(uri);
        this.secret.set(sec);
        this.showTwoFactorSetup.set(true);
        this.twoFactorBusy.set(false);
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to start 2FA setup', 'error');
        this.twoFactorBusy.set(false);
      }
    });
  }

  qrImageUrl(): string | null {
    const uri = this.otpauthUri();
    if (!uri) return null;
    // Use QR Server API which supports CORS
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${uri}`;
  }

  confirmEnable() {
    if (!this.user) return;
    const code = Number.parseInt((this.verificationCode || '').trim(), 10);
    if (!code) {
      this.toastService.show('Enter a valid verification code.', 'error');
      return;
    }
    this.twoFactorBusy.set(true);
    this.auth.enableTwoFactor(this.user.email, code).subscribe({
      next: () => {
        this.toastService.show('Two-Factor Authentication enabled.', 'success');
        this.twoFactorEnabled.set(true);
        this.auth.updateCurrentUser({ twoFactorEnabled: true });
        this.showTwoFactorSetup.set(false);
        this.otpauthUri.set(null);
        this.verificationCode = '';
        this.twoFactorBusy.set(false);
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to enable 2FA', 'error');
        this.twoFactorBusy.set(false);
      }
    });
  }

  cancelSetup() {
    this.showTwoFactorSetup.set(false);
    this.otpauthUri.set(null);
    this.verificationCode = '';
  }
}

