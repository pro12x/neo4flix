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
      <header class="landing-header">
        <div class="logo" routerLink="/">NEO4FLIX</div>
      </header>
      <div class="auth-form">
        <h1>Sign In</h1>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group" *ngIf="!show2Fa">
            <input type="email" placeholder="Email" formControlName="email" required>
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Email is invalid</div>
            </div>
          </div>
          <div class="form-group" *ngIf="!show2Fa">
            <input type="password" placeholder="Password" formControlName="password" required>
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <div *ngIf="f['password'].errors['required']">Password is required</div>
            </div>
          </div>

          <!-- 2FA input shown only when required -->
          <div *ngIf="show2Fa" class="form-group">
            <input #codeInput type="text" placeholder="Enter 2FA code" formControlName="code" required>
            <div *ngIf="submitted && f['code'].errors" class="error-message">
              <div *ngIf="f['code'].errors['required']">2FA code is required</div>
            </div>
          </div>

          <div *ngIf="error" class="error-message">{{ error }}</div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? (show2Fa ? 'Verifying...' : 'Signing In...') : (show2Fa ? 'Verify' : 'Sign In') }}
          </button>
        </form>
        <div class="form-footer" *ngIf="!show2Fa">
          New to Neo4Flix? <a routerLink="/register">Sign up now</a>.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7244cc449/f131061c-f020-4562-b029-5d463f624855/FR-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg');
      background-size: cover;
      position: relative;
    }
    .landing-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 3rem;
    }
    .logo {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      cursor: pointer;
    }
    .auth-form {
      background-color: rgba(0, 0, 0, 0.75);
      padding: 60px;
      border-radius: 4px;
      width: 100%;
      max-width: 450px;
      color: var(--text-color);
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 28px;
    }
    .form-group {
      margin-bottom: 16px;
      position: relative;
    }
    input {
      width: 100%;
      padding: 16px;
      border-radius: 4px;
      border: none;
      background-color: #333;
      color: var(--text-color);
      font-size: 1rem;
    }
    .btn-submit {
      width: 100%;
      padding: 16px;
      border-radius: 4px;
      border: none;
      background-color: var(--primary-color);
      color: var(--text-color);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 24px;
    }
    .form-footer {
      margin-top: 40px;
      color: #737373;
    }
    .form-footer a {
      color: var(--text-color);
      text-decoration: none;
    }
    .form-footer a:hover {
      text-decoration: underline;
    }
    .error-message {
      color: var(--primary-color);
      font-size: 0.8rem;
      margin-top: 6px;
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewChecked {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '/';

  // 2FA state
  show2Fa = false;
  pendingEmail = '';

  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Create form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      code: ['']
    });

    // Get return url from route parameters or default to '/browse'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/browse';
  }

  ngAfterViewChecked(): void {
    // If 2FA input is shown, focus it
    if (this.show2Fa && this.codeInput) {
      try {
        this.codeInput.nativeElement.focus();
      } catch (e) {
        // ignore
      }
    }
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop if form is invalid (email/password when not in 2FA mode, or code when in 2FA mode)
    if (!this.show2Fa && (this.f['email'].invalid || this.f['password'].invalid)) {
      return;
    }
    if (this.show2Fa && this.f['code'].invalid) {
      return;
    }

    this.loading = true;

    if (!this.show2Fa) {
      // initial login attempt
      const loginRequest = { email: this.f['email'].value, password: this.f['password'].value };
      this.authService.login(loginRequest).subscribe({
        next: (res) => {
          console.log('[LoginComponent] login response', res);
          this.loading = false;
          if (res && res["2fa_required"]) {
            // show 2FA input
            this.show2Fa = true;
            this.pendingEmail = res.email || this.f['email'].value;
            // set code validators
            this.f['code'].setValidators([Validators.required]);
            this.f['code'].updateValueAndValidity();
          } else {
            // normal login success
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.error = error.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
    } else {
      // verify 2FA code
      const code = Number(this.f['code'].value);
      this.authService.verifyTwoFactor(this.pendingEmail, code).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.error = error.error?.message || 'Invalid 2FA code.';
          this.loading = false;
        }
      });
    }
  }
}
