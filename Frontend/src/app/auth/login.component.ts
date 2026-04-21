import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="glass-card">
        <div class="header">
          <h2>Welcome Back</h2>
          <p>Login to the Certificate Admin Portal</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="admin@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <div class="password-wrapper">
              <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••" />
              <button type="button" class="eye-icon" (click)="togglePassword()">
                <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
          
          <div *ngIf="errorMsg" class="error-msg">
            <span class="material-icons" style="font-size:16px; margin-right:4px; vertical-align:-3px;">warning</span>
            {{ errorMsg }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn-primary">
            {{ isLoading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background-light);
      font-family: 'Inter', sans-serif;
    }
    .glass-card {
      background: var(--card-bg-light);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      color: var(--text-dark);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h2 { margin: 0 0 10px; font-weight: 600; font-size: var(--font-size-xxl); color: var(--text-dark); }
    .header p { margin: 0; color: var(--text-muted); font-size: var(--font-size-base); }
    
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      font-weight: 500;
    }
    
    .password-wrapper {
      position: relative;
    }
    
    .password-wrapper input {
      padding-right: 45px;
    }

    .eye-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      outline: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    }

    .form-group input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 15px;
      background: var(--background-light);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-dark);
      font-size: var(--font-size-lg);
      outline: none;
      transition: border-color 0.2s;
    }
    .form-group input:focus {
      border-color: var(--primary-color);
    }
    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: var(--font-size-sm);
      text-align: center;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: var(--primary-color);
      color: var(--text-light);
      border: none;
      border-radius: 8px;
      font-size: var(--font-size-lg);
      font-weight: 500;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;
  errorMsg = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMsg = '';

    this.api.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || err.error || 'Invalid credentials.';
      }
    });
  }
}
