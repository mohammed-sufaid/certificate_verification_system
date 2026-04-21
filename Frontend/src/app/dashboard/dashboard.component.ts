import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="metrics-grid" *ngIf="stats">
        <div class="metric-card">
          <div class="card-icon blue"><span class="material-icons">military_tech</span></div>
          <div class="card-content">
            <h3>Total Certificates</h3>
            <div class="value">{{ stats.totalCertificates }}</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="card-icon green"><span class="material-icons">check_circle</span></div>
          <div class="card-content">
            <h3>Active</h3>
            <div class="value text-success">{{ stats.activeCertificates }}</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="card-icon red"><span class="material-icons">cancel</span></div>
          <div class="card-content">
            <h3>Revoked</h3>
            <div class="value text-danger">{{ stats.revokedCertificates }}</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="card-icon purple"><span class="material-icons">business</span></div>
          <div class="card-content">
            <h3>Organizations</h3>
            <div class="value">{{ stats.totalOrganizations }}</div>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <div class="section-title">
          <span class="material-icons">history</span>
          <h3>Recent Activity</h3>
        </div>
        <ul *ngIf="stats?.recentActivities?.length; else noActivity">
          <li *ngFor="let act of stats.recentActivities">
            <div class="activity-icon"><span class="material-icons">person</span></div>
            <div class="activity-details">
              <p><strong>{{ act.user }}</strong> performed <em>{{ act.action }}</em></p>
              <small>{{ act.createdDate | date:'medium' }}</small>
            </div>
          </li>
        </ul>
        <ng-template #noActivity><p class="empty-msg">No recent activity found.</p></ng-template>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .metric-card {
      background: var(--card-bg-light);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .card-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .card-icon.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .card-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

    .card-content h3 {
      margin: 0 0 4px;
      color: var(--text-muted);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .card-content .value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-dark);
    }

    .text-success { color: #10b981 !important; }
    .text-danger { color: #ef4444 !important; }
    
    .recent-activity {
      background: var(--card-bg-light);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      color: var(--text-dark);
    }
    .section-title .material-icons { color: var(--primary-color); }
    .section-title h3 { margin: 0; font-size: var(--font-size-lg); }

    .recent-activity ul { list-style: none; padding: 0; margin: 0; }
    .recent-activity li {
      display: flex;
      gap: 15px;
      padding: 16px 0;
      border-bottom: 1px solid var(--border-color);
    }
    .recent-activity li:last-child { border-bottom: none; }

    .activity-icon {
      width: 36px;
      height: 36px;
      background: var(--background-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }
    .activity-details p { margin: 0; color: var(--text-dark); font-size: var(--font-size-base); }
    .activity-details small { color: var(--text-muted); font-size: 12px; }

    @media (max-width: 640px) {
      .metrics-grid { grid-template-columns: 1fr; }
      .metric-card { padding: 20px; }
      .card-content .value { font-size: 24px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats: any = null;

  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next: (res: any) => this.stats = res,
      error: (err: any) => console.error(err)
    });
  }
}
