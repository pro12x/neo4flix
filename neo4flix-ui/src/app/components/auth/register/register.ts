import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <!-- Animated Background -->
      <div class="background-video">
        <div class="video-overlay"></div>
        <div class="particles-container">
          <div class="particle" *ngFor="let particle of particles"></div>
        </div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <!-- Header -->
      <header class="auth-header">
        <div class="logo" routerLink="/">
          <span class="logo-text">NEO4FLIX</span>
          <div class="logo-glow"></div>
        </div>
      </header>

      <!-- Main Auth Form -->
      <main class="auth-main">
        <div class="auth-card">
          <div class="form-section">
            <div class="form-header">
              <h1 class="form-title">Join Neo4Flix</h1>
              <p class="form-subtitle">Create your account and start watching</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <!-- Name Fields Row -->
              <div class="form-row">
                <div class="form-group">
                  <div class="input-wrapper">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="First Name"
                      formControlName="firstName"
                      class="form-input"
                      autocomplete="given-name"
                    />
                    <div class="input-focus"></div>
                  </div>
                  <div *ngIf="submitted && f['firstName'].errors" class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>First name is required</span>
                  </div>
                </div>

                <div class="form-group">
                  <div class="input-wrapper">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Last Name"
                      formControlName="lastName"
                      class="form-input"
                      autocomplete="family-name"
                    />
                    <div class="input-focus"></div>
                  </div>
                  <div *ngIf="submitted && f['lastName'].errors" class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>Last name is required</span>
                  </div>
                </div>
              </div>

              <!-- Pseudo Field -->
              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M16 11l2 2 4-4"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Username"
                    formControlName="pseudo"
                    class="form-input"
                    autocomplete="username"
                  />
                  <div class="input-focus"></div>
                </div>
                <div *ngIf="submitted && f['pseudo'].errors" class="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <span>Username is required</span>
                </div>
              </div>

              <!-- Email Field -->
              <div class="form-group">
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="Email address"
                    formControlName="email"
                    class="form-input"
                    autocomplete="email"
                  />
                  <div class="input-focus"></div>
                </div>
                <div *ngIf="submitted && f['email'].errors" class="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <span>{{ f['email'].errors['required'] ? 'Email is required' : 'Invalid email format' }}</span>
                </div>
              </div>

              <!-- Password Fields Row -->
              <div class="form-row">
                <div class="form-group">
                  <div class="input-wrapper">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="m9 11 3-3 3 3"/>
                    </svg>
                    <input
                      type="password"
                      placeholder="Password"
                      formControlName="password"
                      class="form-input"
                      autocomplete="new-password"
                    />
                    <div class="input-focus"></div>
                  </div>
                  <div *ngIf="submitted && f['password'].errors" class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>{{ f['password'].errors['required'] ? 'Password is required' : f['password'].errors['minlength'] ? 'At least 8 characters' : 'Must contain uppercase, lowercase, number & special char' }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <div class="input-wrapper">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="m9 11 3-3 3 3"/>
                    </svg>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      formControlName="confirmPassword"
                      class="form-input"
                      autocomplete="new-password"
                    />
                    <div class="input-focus"></div>
                  </div>
                  <div *ngIf="submitted && f['confirmPassword'].errors" class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>Confirm password is required</span>
                  </div>
                  <div *ngIf="submitted && registerForm.errors?.['passwordMismatch']" class="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>Passwords do not match</span>
                  </div>
                </div>
              </div>

              <!-- Password Requirements -->
              <div class="password-requirements" *ngIf="f['password'].value">
                <h4>Password must contain:</h4>
                <div class="requirement" [class.met]="hasUpperCase()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  At least one uppercase letter
                </div>
                <div class="requirement" [class.met]="hasLowerCase()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  At least one lowercase letter
                </div>
                <div class="requirement" [class.met]="hasNumber()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  At least one number
                </div>
                <div class="requirement" [class.met]="hasSpecialChar()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  At least one special character
                </div>
                <div class="requirement" [class.met]="hasMinLength()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  Minimum 8 characters
                </div>
              </div>

              <div *ngIf="error" class="error-message global-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{{ error }}</span>
              </div>

              <button type="submit" class="btn-submit" [disabled]="loading">
                <span class="btn-text">{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
                <svg *ngIf="loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416" class="spinner-circle"/>
                </svg>
                <div class="btn-glow"></div>
              </button>
            </form>

            <div class="form-footer">
              <span>Already have an account?</span>
              <a routerLink="/login" class="link-login">Sign in here</a>
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

    .auth-container {
      position: relative;
      height: 100vh;
      overflow: hidden;
    }

    /* Animated Background */
    .background-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(20, 20, 40, 0.7) 50%,
        rgba(0, 0, 0, 0.85) 100%
      );
      backdrop-filter: blur(2px);
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
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      animation: float 25s infinite linear;
    }

    .particle:nth-child(1) { width: 3px; height: 3px; left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { width: 5px; height: 5px; left: 20%; animation-delay: 2s; }
    .particle:nth-child(3) { width: 2px; height: 2px; left: 30%; animation-delay: 4s; }
    .particle:nth-child(4) { width: 4px; height: 4px; left: 40%; animation-delay: 6s; }
    .particle:nth-child(5) { width: 3px; height: 3px; left: 50%; animation-delay: 8s; }
    .particle:nth-child(6) { width: 6px; height: 6px; left: 60%; animation-delay: 10s; }
    .particle:nth-child(7) { width: 2px; height: 2px; left: 70%; animation-delay: 12s; }
    .particle:nth-child(8) { width: 4px; height: 4px; left: 80%; animation-delay: 14s; }
    .particle:nth-child(9) { width: 3px; height: 3px; left: 90%; animation-delay: 16s; }
    .particle:nth-child(10) { width: 5px; height: 5px; left: 95%; animation-delay: 18s; }

    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
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
      background: linear-gradient(45deg, rgba(229, 9, 20, 0.08), rgba(178, 7, 16, 0.08));
      border: 1px solid rgba(229, 9, 20, 0.15);
      animation: shapeFloat 30s infinite linear;
    }

    .shape-1 {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      top: 15%;
      left: 15%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 50px;
      height: 50px;
      border-radius: 15px;
      top: 70%;
      right: 20%;
      animation-delay: 8s;
    }

    .shape-3 {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      top: 45%;
      left: 70%;
      animation-delay: 15s;
    }

    @keyframes shapeFloat {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.4;
      }
      25% {
        transform: translateY(-20px) rotate(90deg) scale(1.1);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-40px) rotate(180deg) scale(0.9);
        opacity: 0.5;
      }
      75% {
        transform: translateY(-20px) rotate(270deg) scale(1.05);
        opacity: 0.6;
      }
      100% {
        transform: translateY(0px) rotate(360deg) scale(1);
        opacity: 0.4;
      }
    }

    /* Header */
    .auth-header {
      position: relative;
      z-index: 10;
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
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo-text {
      font-size: 2.2rem;
      font-weight: 700;
      color: #e50914;
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

    /* Main Content */
    .auth-main {
      position: relative;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      padding: 2rem;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 3rem;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
      animation: cardFadeIn 1.2s ease-out 0.3s both;
    }

    @keyframes cardFadeIn {
      from {
        transform: translateY(30px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    /* Form Sections */
    .form-section {
      animation: formFadeIn 0.3s ease-out 0.2s both;
    }

    @keyframes formFadeIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .form-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .form-title {
      font-size: clamp(2rem, 4vw, 2.5rem);
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .form-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      margin: 0;
    }

    .auth-form {
      animation: formElementsFadeIn 1s ease-out 0.8s both;
    }

    @keyframes formElementsFadeIn {
      from {
        transform: translateY(15px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* Form Rows */
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    /* Form Groups */
    .form-group {
      margin-bottom: 1.5rem;
    }

    .input-wrapper {
      position: relative;
      margin-bottom: 0.5rem;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      z-index: 3;
      transition: color 0.3s ease;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #ffffff;
      font-size: 1rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .form-input:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 25px rgba(229, 9, 20, 0.2);
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .input-focus {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 12px;
      background: linear-gradient(45deg, #e50914, #b20710);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
      filter: blur(12px);
    }

    .form-input:focus + .input-focus {
      opacity: 0.1;
    }

    /* Password Requirements */
    .password-requirements {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .password-requirements h4 {
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .requirement {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .requirement.met {
      color: #4ade80;
    }

    .requirement svg {
      width: 16px;
      height: 16px;
      color: rgba(255, 255, 255, 0.4);
      flex-shrink: 0;
    }

    .requirement.met svg {
      color: #4ade80;
    }

    /* Error Messages */
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ff6b6b;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      animation: errorShake 0.5s ease-out;
    }

    .error-message.global-error {
      justify-content: center;
      padding: 1rem;
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.2);
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* Submit Button */
    .btn-submit {
      width: 100%;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      margin-top: 1rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-spinner {
      position: relative;
      z-index: 2;
      animation: spin 1s linear infinite;
    }

    .spinner-circle {
      animation: spinner-dash 1.5s ease-in-out infinite;
    }

    @keyframes spinner-dash {
      0% { stroke-dashoffset: 31.416; }
      50% { stroke-dashoffset: 15.708; }
      100% { stroke-dashoffset: 31.416; }
    }

    .btn-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, #f40612, #d01018);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .btn-submit:hover:not(:disabled) .btn-glow {
      opacity: 1;
    }

    /* Form Footer */
    .form-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .form-footer span {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
    }

    .link-login {
      color: #e50914;
      text-decoration: none;
      font-weight: 500;
      margin-left: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .link-login:hover {
      color: #f40612;
      text-decoration: underline;
    }

    .link-login::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(45deg, #e50914, #b20710);
      transition: width 0.3s ease;
    }

    .link-login:hover::after {
      width: 100%;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .auth-header {
        padding: 1.5rem 2rem;
      }

      .logo-text {
        font-size: 1.8rem;
      }

      .auth-main {
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem;
        margin: 0;
      }

      .form-title {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .password-requirements {
        padding: 1rem;
      }

      .btn-submit {
        font-size: 1rem;
        padding: 0.875rem 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .form-header {
        margin-bottom: 2rem;
      }

      .form-title {
        font-size: 1.75rem;
      }

      .form-subtitle {
        font-size: 0.9rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  particles: number[] = Array(10).fill(0);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      pseudo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  get f() { return this.registerForm.controls; }

  passwordStrengthValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return !passwordValid ? { passwordStrength: true } : null;
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      const errors = confirmPassword?.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.f['password'].value || '');
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.f['password'].value || '');
  }

  hasNumber(): boolean {
    return /\d/.test(this.f['password'].value || '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.f['password'].value || '');
  }

  hasMinLength(): boolean {
    return (this.f['password'].value || '').length >= 8;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      pseudo: this.registerForm.value.pseudo,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Registration failed';
      }
    });
  }
}
