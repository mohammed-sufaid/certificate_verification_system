import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="verify-page">
      <div class="glass-container form-card">
        <div class="brand">
          <div class="logo"></div>
        </div>
        
        <h1 class="title">Verify Authenticity</h1>
        <p class="subtitle">Enter a unique certificate ID to instantly validate its cryptographic integrity on our ledger.</p>
        
        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()" class="verify-form">
          <div class="input-wrapper">
            <span class="search-icon material-icons">search</span>
            <input 
              type="text" 
              formControlName="certificateNumber" 
              placeholder="Enter Certificate ID (e.g. CERT-123456)" 
              class="verify-input" 
              autocomplete="off" />
          </div>
          <button type="submit" class="btn-primary wave-effect" [disabled]="verifyForm.invalid || isLoading">
            <span *ngIf="!isLoading">Verify Now</span>
            <div *ngIf="isLoading" class="spinner"></div>
          </button>
        </form>

        <!-- Dynamic Results Core -->
        <div class="result-wrapper" *ngIf="result" [ngClass]="{'show': result}">
          
          <!-- Authentic Certificate -->
          <div class="result-card valid" *ngIf="result.authentic">
            <div class="status-header">
              <div class="icon-pulse">
                <span class="icon check material-icons">check</span>
              </div>
              <div>
                <h3 class="status-title">100% Authentic</h3>
                <p class="status-desc">Cryptographic signature verified successfully.</p>
              </div>
            </div>
            
            <div class="cert-data" *ngIf="result.data">
              <div class="data-row">
                <span class="data-label">Candidate</span>
                <span class="data-value">{{ result.data.candidateName }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Course</span>
                <span class="data-value">{{ result.data.courseName }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Issued By</span>
                <span class="data-value">{{ result.data.organizationName }}</span>
              </div>
              <div class="data-row">
                <span class="data-label">Issue Date</span>
                <span class="data-value">{{ result.data.issueDate | date:'mediumDate' }}</span>
              </div>
              <div class="hash-foot">
                <span class="hash-label">Blockchain Hash:</span>
                <code class="hash-value">{{ result.data.currentHash | slice:0:16 }}...</code>
              </div>
            </div>
          </div>

          <!-- Invalid/Tampered Certificate -->
          <div class="result-card invalid" *ngIf="!result.authentic">
            <div class="status-header">
              <div class="icon-pulse error-pulse">
                <span class="icon cross material-icons">close</span>
              </div>
              <div>
                <h3 class="status-title error-title">Invalid or Tampered</h3>
                <p class="status-desc error-desc">{{ result.message }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--background-light);
      position: relative;
      font-family: 'Inter', sans-serif;
      padding: 20px;
    }

    /* Core Card */
    .glass-container {
      position: relative;
      z-index: 10;
      background: var(--card-bg-light);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 50px 40px;
      max-width: 560px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
      text-align: center;
      color: var(--text-dark);
      transition: all 0.3s ease;
    }

    .brand .logo {
      width: 56px; height: 56px;
      background: var(--primary-color);
      border-radius: 16px;
      margin: 0 auto 24px;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
    }
    
    .title {
      font-size: var(--font-size-title);
      font-weight: 700;
      margin: 0 0 12px;
      letter-spacing: -0.5px;
      color: var(--text-dark);
    }
    .subtitle {
      font-size: var(--font-size-md);
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 35px;
    }

    /* Search Form */
    .verify-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 25px;
    }
    .input-wrapper {
      position: relative;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      color: #94a3b8;
    }
    .verify-input {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 20px 16px 50px;
      background: var(--background-light);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      font-size: var(--font-size-lg);
      color: var(--text-dark);
      outline: none;
      transition: all 0.3s ease;
    }
    .verify-input::placeholder { color: #94a3b8; }
    .verify-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .btn-primary {
      padding: 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: var(--font-size-lg);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
    }
    .btn-primary:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      box-shadow: none;
      opacity: 0.7;
    }

    /* CSS Spinner */
    .spinner {
      width: 20px; height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Results Area */
    .result-wrapper {
      margin-top: 10px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .result-wrapper.show {
      opacity: 1;
      transform: translateY(0);
    }

    .result-card {
      border-radius: 16px;
      padding: 24px;
      text-align: left;
    }
    .result-card.valid {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
    .result-card.invalid {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    .icon-pulse {
      width: 48px; height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #dcfce7;
      color: #16a34a;
      font-size: 24px;
      font-weight: bold;
      position: relative;
    }
    .icon-pulse::after {
      content: '';
      position: absolute;
      width: 100%; height: 100%;
      border-radius: 50%;
      background: inherit;
      animation: pulse 2s infinite;
      z-index: 0; /* Behind the icon */
    }
    .icon-pulse .icon {
      position: relative;
      z-index: 1; /* In front of pulse */
    }
    .icon-pulse.error-pulse {
      background: #fee2e2;
      color: #dc2626;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    .status-title { margin: 0 0 4px; font-size: 18px; color: #16a34a; font-weight: 600; }
    .status-desc { margin: 0; font-size: 14px; color: #15803d; opacity: 0.8; }
    
    .status-title.error-title { color: #dc2626; }
    .status-desc.error-desc { color: #b91c1c; }

    /* Data Layout */
    .cert-data {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e2e8f0;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-row:last-of-type { border-bottom: none; }
    .data-label { color: #64748b; font-size: 13px; font-weight: 500; }
    .data-value { color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;}

    .hash-foot {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hash-label { font-size: 12px; color: #64748b; }
    .hash-value { background: #eff6ff; color: #2563eb; padding: 4px 8px; border-radius: 4px; font-size: 12px; }

    /* Responsive scaling */
    @media (max-width: 500px) {
      .glass-container { padding: 30px 20px; border-radius: 20px; }
      .data-row { flex-direction: column; align-items: flex-start; gap: 4px; }
      .data-value { text-align: left; }
    }
  `]
})
export class VerifyComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  verifyForm = this.fb.group({
    certificateNumber: ['', Validators.required]
  });

  isLoading = false;
  result: any = null;

  onSubmit() {
    if (this.verifyForm.valid) {
      this.isLoading = true;
      this.result = null;
      const certNo = this.verifyForm.value.certificateNumber!;
      
      this.api.verifyCertificate(certNo).subscribe({
        next: (res: any) => {
          this.result = res;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.result = { authentic: false, message: err.error?.message || 'Hash mismatches detected in Data Pipeline. Verification failed.' };
          this.isLoading = false;
        }
      });
    }
  }
}
