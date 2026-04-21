import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header-actions">
      <h2>System Settings</h2>
    </div>

    <div class="form-card">
      <div class="settings-section">
        <div class="section-header">
          <span class="material-icons">info</span>
          <h3>System Information</h3>
        </div>
        <p class="section-desc">View the current operational status and version details of the platform.</p>
        
        <div class="info-grid">
          <div class="info-item">
            <label>Platform Version</label>
            <div class="value">v1.0.0-stable</div>
          </div>
          <div class="info-item">
            <label>Environment</label>
            <div class="value"><span class="badge active">Production</span></div>
          </div>
          <div class="info-item">
            <label>Cryptographic Standard</label>
            <div class="value">SHA-256 (256-bit)</div>
          </div>
          <div class="info-item">
            <label>Timezone</label>
            <div class="value">UTC+00:00</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-actions { margin-bottom: 25px; }
    .header-actions h2 { margin: 0; color: var(--text-dark); font-size: var(--font-size-xxl); }

    .form-card { 
      background: var(--card-bg-light); 
      padding: 30px; 
      border-radius: 12px; 
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }

    .settings-section {
      margin-bottom: 30px;
    }
    .settings-section:last-child { margin-bottom: 0; }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
      color: var(--text-dark);
    }
    .section-header .material-icons {
      color: var(--primary-color);
      font-size: 24px;
    }
    .section-header h3 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: 600;
    }

    .section-desc {
      margin: 0 0 20px 34px;
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-left: 34px;
      background: var(--background-light);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .info-item label {
      display: block;
      color: var(--text-muted);
      font-size: var(--font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .info-item .value {
      color: var(--text-dark);
      font-size: var(--font-size-base);
      font-weight: 500;
    }
    
    .badge {
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.active {
      background: rgba(22, 101, 52, 0.1);
      color: #166534;
    }
  `]
})
export class SettingsComponent {}
