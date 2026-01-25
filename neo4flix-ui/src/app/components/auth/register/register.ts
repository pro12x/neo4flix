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
      <header class="landing-header">
        <div class="logo" routerLink="/">NEO4FLIX</div>
      </header>
      <div class="auth-form">
        <h1>Sign Up</h1>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input type="text" placeholder="First Name" formControlName="firstName" required>
            <div *ngIf="submitted && f['firstName'].errors" class="error-message">
              <div *ngIf="f['firstName'].errors['required']">First name is required</div>
            </div>
          </div>
          <div class="form-group">
            <input type="text" placeholder="Last Name" formControlName="lastName" required>
            <div *ngIf="submitted && f['lastName'].errors" class="error-message">
              <div *ngIf="f['lastName'].errors['required']">Last name is required</div>
            </div>
          </div>
          <div class="form-group">
            <input type="text" placeholder="Pseudo" formControlName="pseudo" required>
            <div *ngIf="submitted && f['pseudo'].errors" class="error-message">
              <div *ngIf="f['pseudo'].errors['required']">Pseudo is required</div>
            </div>
          </div>
          <div class="form-group">
            <input type="email" placeholder="Email" formControlName="email" required>
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Email is invalid</div>
            </div>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Password" formControlName="password" required>
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <div *ngIf="f['password'].errors['required']">Password is required</div>
              <div *ngIf="f['password'].errors['minlength']">Password must be at least 8 characters</div>
              <div *ngIf="f['password'].errors['passwordStrength']">Password must contain uppercase, lowercase, number, and special character</div>
            </div>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Confirm Password" formControlName="confirmPassword" required>
            <div *ngIf="submitted && f['confirmPassword'].errors" class="error-message">
              <div *ngIf="f['confirmPassword'].errors['required']">Confirm Password is required</div>
            </div>
            <div *ngIf="submitted && registerForm.errors?.['passwordMismatch']" class="error-message">
              Passwords do not match
            </div>
          </div>
          <div *ngIf="error" class="error-message">{{ error }}</div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Signing Up...' : 'Sign Up' }}
          </button>
        </form>
        <div class="form-footer">
          Already have an account? <a routerLink="/login">Sign in</a>.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem 0;
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ '-]{2,50}$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ '-]{2,50}$/)]],
      pseudo: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]{2,20}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  // Custom password validator
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    return valid ? null : { passwordStrength: true };
  }

  // Password match validator
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/browse']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
