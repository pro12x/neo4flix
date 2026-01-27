import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
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
        <div class="auth-card" [class.slide-up]="show2Fa">
          <!-- Login Form -->
          <div class="form-section" *ngIf="!show2Fa">
            <div class="form-header">
              <h1 class="form-title">Welcome Back</h1>
              <p class="form-subtitle">Sign in to your account</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
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
                    autocomplete="current-password"
                  />
                  <div class="input-focus"></div>
                </div>
                <div *ngIf="submitted && f['password'].errors" class="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <span>Password is required</span>
                </div>
              </div>

              <div *ngIf="error && !show2Fa" class="error-message global-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{{ error }}</span>
              </div>

              <button type="submit" class="btn-submit" [disabled]="loading">
                <span class="btn-text">{{ loading ? 'Signing In...' : 'Sign In' }}</span>
                <svg *ngIf="loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416" class="spinner-circle"/>
                </svg>
                <div class="btn-glow"></div>
              </button>
            </form>

            <div class="form-footer">
              <span>New to Neo4Flix?</span>
              <a routerLink="/register" class="link-register">Create an account</a>
            </div>
          </div>

          <!-- 2FA Verification -->
          <div class="form-section" *ngIf="show2Fa">
            <div class="form-header">
              <h1 class="form-title">Two-Factor Authentication</h1>
              <p class="form-subtitle">Enter the code from your authenticator app</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <div class="input-wrapper code-input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="m9 11 3-3 3 3"/>
                  </svg>
                  <input
                    #codeInput
                    type="text"
                    placeholder="000000"
                    formControlName="code"
                    class="form-input code-input"
                    maxlength="6"
                    autocomplete="one-time-code"
                  />
                  <div class="input-focus"></div>
                </div>
                <div *ngIf="submitted && f['code'].errors" class="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <span>2FA code is required</span>
                </div>
              </div>

              <div *ngIf="error && show2Fa" class="error-message global-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{{ error }}</span>
              </div>

              <button type="submit" class="btn-submit" [disabled]="loading">
                <span class="btn-text">{{ loading ? 'Verifying...' : 'Verify Code' }}</span>
                <svg *ngIf="loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416" class="spinner-circle"/>
                </svg>
                <div class="btn-glow"></div>
              </button>

              <button type="button" class="btn-back" (click)="backToLogin()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Sign In
              </button>
            </form>
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

    .particle:nth-child(1) { width: 3px; height: 3px; left: 15%; animation-delay: 0s; }
    .particle:nth-child(2) { width: 5px; height: 5px; left: 25%; animation-delay: 3s; }
    .particle:nth-child(3) { width: 2px; height: 2px; left: 35%; animation-delay: 6s; }
    .particle:nth-child(4) { width: 4px; height: 4px; left: 45%; animation-delay: 9s; }
    .particle:nth-child(5) { width: 3px; height: 3px; left: 55%; animation-delay: 12s; }
    .particle:nth-child(6) { width: 6px; height: 6px; left: 65%; animation-delay: 15s; }
    .particle:nth-child(7) { width: 2px; height: 2px; left: 75%; animation-delay: 18s; }
    .particle:nth-child(8) { width: 4px; height: 4px; left: 85%; animation-delay: 21s; }

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
      width: 60px;
      height: 60px;
      border-radius: 50%;
      top: 25%;
      right: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 40px;
      height: 40px;
      border-radius: 15px;
      top: 70%;
      left: 20%;
      animation-delay: 10s;
    }

    @keyframes shapeFloat {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.4;
      }
      25% {
        transform: translateY(-15px) rotate(90deg) scale(1.1);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-30px) rotate(180deg) scale(0.9);
        opacity: 0.5;
      }
      75% {
        transform: translateY(-15px) rotate(270deg) scale(1.05);
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
      max-width: 480px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
      animation: cardFadeIn 1.2s ease-out 0.3s both;
      transition: all 0.3s ease;
    }

    .auth-card.slide-up {
      animation: cardSlideUp 0.5s ease-out both;
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

    @keyframes cardSlideUp {
      from {
        transform: translateY(20px);
        opacity: 0.8;
      }
      to {
        transform: translateY(0);
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

    .code-input-wrapper {
      text-align: center;
    }

    .code-input {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.5rem;
      padding-left: 3.5rem;
    }

    .code-input::placeholder {
      letter-spacing: normal;
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

    /* Back Button */
    .btn-back {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
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

    .link-register {
      color: #e50914;
      text-decoration: none;
      font-weight: 500;
      margin-left: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .link-register:hover {
      color: #f40612;
      text-decoration: underline;
    }

    .link-register::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(45deg, #e50914, #b20710);
      transition: width 0.3s ease;
    }

    .link-register:hover::after {
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

      .form-input {
        padding: 0.875rem 0.875rem 0.875rem 2.75rem;
        font-size: 0.95rem;
      }

      .input-icon {
        left: 0.875rem;
        width: 18px;
        height: 18px;
      }

      .code-input {
        font-size: 1.25rem;
        letter-spacing: 0.25rem;
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
export class LoginComponent implements OnInit, AfterViewChecked {
  @ViewChild('codeInput') codeInput!: ElementRef;

  loginForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  show2Fa = false;

  particles: number[] = Array(8).fill(0);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      code: ['']
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewChecked() {
    if (this.show2Fa && this.codeInput) {
      this.codeInput.nativeElement.focus();
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid && !this.show2Fa) {
      return;
    }

    if (this.show2Fa && !this.loginForm.value.code) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.show2Fa) {
      this.authService.verifyTwoFactor(this.loginForm.value.email, parseInt(this.loginForm.value.code)).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.loading = false;
          this.error = error.error?.message || 'Invalid 2FA code';
        }
      });
    } else {
      this.authService.login({ email: this.loginForm.value.email, password: this.loginForm.value.password }).subscribe({
        next: (response) => {
          this.loading = false;
          if (response['2fa_required']) {
            this.show2Fa = true;
            this.error = '';
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.error = error.error?.message || 'Login failed';
        }
      });
    }
  }

  backToLogin() {
    this.show2Fa = false;
    this.error = '';
    this.submitted = false;
    this.loginForm.patchValue({ code: '' });
  }
}
