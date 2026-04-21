import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  template: `
    <div class="header-actions">
      <h2>Certificate Registry</h2>
      <button class="btn-primary" (click)="toggleForm()">
        <span class="material-icons" style="font-size:18px; margin-right:4px; vertical-align:-3px;">workspace_premium</span> Issue Certificate
      </button>
    </div>

    <!-- Issue Certificate Form -->
    <div class="form-card" *ngIf="showForm">
      <h3>Issue New Certificate</h3>
      <form [formGroup]="certForm" (ngSubmit)="saveCertificate()">
        <div class="form-grid">
          <div class="form-group">
            <label>Certificate Number</label>
            <input formControlName="certificateNumber" placeholder="CERT-2026-XXXX" />
          </div>
          <div class="form-group">
            <label>Candidate Name</label>
            <input formControlName="candidateName" placeholder="Candidate Full Name" />
          </div>
          <div class="form-group">
            <label>Course Name</label>
            <input formControlName="courseName" placeholder="Computer Science" />
          </div>
          <div class="form-group">
            <label>Grade/Score</label>
            <input formControlName="grade" placeholder="A+" />
          </div>
          <div class="form-group">
            <label>Issue Date</label>
            <input type="date" formControlName="issueDate" />
          </div>
          <div class="form-group">
            <label>Expiry Date (Optional)</label>
            <input type="date" formControlName="expiryDate" />
          </div>
          <div class="form-group full-width" *ngIf="isAdmin">
            <label>Issuing Organization</label>
            <select formControlName="organizationId">
              <option *ngFor="let org of organizations" [ngValue]="org.id">{{ org.name }}</option>
            </select>
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn-cancel" (click)="toggleForm()">Cancel</button>
          <button type="submit" class="btn-save" [disabled]="certForm.invalid">Issue to Blockchain</button>
        </div>
      </form>
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Cert No.</th>
              <th>Candidate</th>
              <th>Course</th>
              <th>Issued On</th>
              <th>Status</th>
              <th>Hash Integrity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody *ngIf="certificates.length > 0; else noData">
            <tr *ngFor="let c of certificates">
              <td><strong>{{ c.certificateNumber }}</strong></td>
              <td>{{ c.candidateName }}</td>
              <td>{{ c.courseName }}</td>
              <td>{{ c.issueDate | date:'mediumDate' }}</td>
              <td>
                <span class="badge" [ngClass]="c.status.toLowerCase()">
                  {{ c.status }}
                </span>
              </td>
              <td><code class="hash">{{ c.currentHash | slice:0:12 }}...</code></td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view" (click)="viewCert(c.certificateNumber)" title="View Public Page">
                    <span class="material-icons">visibility</span>
                  </button>
                  <button class="action-btn delete" *ngIf="c.status !== 'Revoked' && isAdmin" (click)="revokeCert(c.id)" title="Revoke Certificate">
                    <span class="material-icons">block</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <ng-template #noData>
            <tbody><tr><td colspan="7" class="empty-state">No certificates issued yet.</td></tr></tbody>
          </ng-template>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; gap: 15px; }
    .header-actions h2 { margin: 0; color: var(--text-dark); font-size: var(--font-size-xxl); }
    .btn-primary { background: var(--primary-color); color: var(--text-light); border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; white-space: nowrap;}

    .form-card { background: var(--card-bg-light); padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid var(--border-color); }
    .form-card h3 { margin: 0 0 20px; font-size: var(--font-size-xl); color: var(--text-dark); }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .full-width { grid-column: span 2; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }

    .form-group label { display: block; margin-bottom: 8px; font-size: var(--font-size-sm); color: var(--text-muted); font-weight: 500;}
    .form-group input, .form-group select { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: var(--font-size-base); outline: none; }
    .form-group input:focus, .form-group select:focus { border-color: var(--primary-color); }
    
    .actions { display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 20px; }
    .btn-cancel { background: var(--card-bg-light); border: 1px solid var(--border-color); color: var(--text-dark); padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .btn-save { background: #10b981; color: var(--text-light); border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    
    .table-container { background: var(--card-bg-light); border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
    .table-responsive { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 900px; }
    th { background: var(--background-light); text-align: left; padding: 15px 20px; color: var(--text-muted); font-weight: 600; font-size: var(--font-size-sm); border-bottom: 1px solid var(--border-color); }
    td { padding: 15px 20px; border-bottom: 1px solid var(--border-color); font-size: var(--font-size-base); color: var(--text-dark); }
    
    .badge { padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge.active { background: rgba(22, 101, 52, 0.1); color: #166534; }
    .badge.revoked { background: rgba(153, 27, 27, 0.1); color: #991b1b; }
    .hash { background: var(--background-light); color: var(--secondary-color); padding: 4px 6px; border-radius: 4px; font-size: 12px; border: 1px solid var(--border-color); }
    
    .action-buttons { display: flex; gap: 8px; }
    .action-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .action-btn .material-icons { font-size: 18px; }
    .action-btn.view { color: #10b981; background: rgba(16, 185, 129, 0.1); }
    .action-btn.delete { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
    .empty-state { text-align: center; color: var(--text-muted); padding: 30px; }

    @media (max-width: 640px) {
      .header-actions { flex-direction: column; align-items: stretch; }
      .header-actions h2 { font-size: var(--font-size-xl); }
      .form-card { padding: 20px; }
    }
  `]
})
export class CertificateListComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  certificates: any[] = [];
  organizations: any[] = [];
  showForm = false;
  isAdmin = false;
  currentUserOrgId: number | null = null;

  certForm = this.fb.group({
    certificateNumber: ['', Validators.required],
    candidateName: ['', Validators.required],
    courseName: ['', Validators.required],
    grade: ['', Validators.required],
    issueDate: ['', Validators.required],
    expiryDate: [null],
    organizationId: [null as number | null, Validators.required]
  });

  ngOnInit() {
    this.api.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'Admin';
      if (user?.organizationId) {
        this.currentUserOrgId = user.organizationId;
        this.certForm.controls.organizationId.setValue(user.organizationId);
      }
    });

    this.loadData();
    if (this.isAdmin) {
      this.api.getOrganizations().subscribe(res => this.organizations = res);
    }
  }

  loadData() {
    this.api.getCertificates().subscribe((res: any) => this.certificates = res.data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.certForm.reset();
      if (this.currentUserOrgId) {
        this.certForm.controls.organizationId.setValue(this.currentUserOrgId);
      }
    }
  }

  saveCertificate() {
    if (this.certForm.invalid) return;

    this.api.createCertificate(this.certForm.value).subscribe({
      next: () => {
        this.loadData();
        this.toggleForm();
      },
      error: (err: any) => alert(err.error || 'Failed to issue certificate')
    });
  }

  revokeCert(id: number) {
    if (confirm('Are you sure you want to permanently revoke this certificate?')) {
      this.api.revokeCertificate(id).subscribe({
        next: () => this.loadData(),
        error: (err: any) => alert(err.error || 'Failed to revoke')
      });
    }
  }

  viewCert(certNo: string) {
    window.open(`http://localhost:4200/verify?cert=${certNo}`, '_blank');
  }
}
