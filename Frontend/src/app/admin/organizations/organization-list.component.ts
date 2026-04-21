import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header-actions">
      <h2>Manage Organizations</h2>
      <button class="btn-primary" (click)="toggleForm()">
        <span class="material-icons" style="font-size:18px; margin-right:4px; vertical-align:-3px;">add</span> Add Organization
      </button>
    </div>

    <!-- Create/Edit Form Modal/Card -->
    <div class="form-card" *ngIf="showForm">
      <h3>{{ isEditing ? 'Edit Organization' : 'Create Organization' }}</h3>
      <form [formGroup]="orgForm" (ngSubmit)="saveOrg()">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Organization Name</label>
            <input formControlName="name" placeholder="ABC University" />
          </div>
          
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="contact@org.com" />
          </div>
          
          <div class="form-group">
            <label>Phone Number</label>
            <input formControlName="phone" placeholder="+1 234 567 890" />
          </div>

          <div class="form-group full-width">
            <label>Physical Address</label>
            <input formControlName="address" placeholder="123 Education Lane, City, Country" />
          </div>

          <div class="form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 25px;">
            <input type="checkbox" formControlName="isActive" id="isActive" style="width: auto;" />
            <label for="isActive" style="margin-bottom: 0;">Is Active Organization</label>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" (click)="toggleForm()">Cancel</button>
          <button type="submit" class="btn-save" [disabled]="orgForm.invalid">Save organization</button>
        </div>
      </form>
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody *ngIf="organizations.length > 0; else noData">
            <tr *ngFor="let org of organizations">
              <td>#{{ org.id }}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="org-avatar">{{ org.name | slice:0:1 }}</div>
                  <strong>{{ org.name }}</strong>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <span *ngIf="org.email"><span class="material-icons">email</span> {{ org.email }}</span>
                  <span *ngIf="org.phone"><span class="material-icons">phone</span> {{ org.phone }}</span>
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="org.isActive ? 'active' : 'inactive'">
                  {{ org.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" (click)="editOrg(org)">
                    <span class="material-icons">edit</span>
                  </button>
                  <button class="action-btn delete" (click)="deleteOrg(org.id)">
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <ng-template #noData>
            <tbody><tr><td colspan="5" class="empty-state">No organizations found.</td></tr></tbody>
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
    .form-card h3 { margin: 0 0 25px; font-size: var(--font-size-xl); color: var(--text-dark); }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
    .full-width { grid-column: span 2; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }

    .form-group label { display: block; margin-bottom: 8px; font-size: var(--font-size-sm); color: var(--text-muted); font-weight: 500;}
    .form-group input { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: var(--font-size-base); outline: none; }
    .form-group input:focus { border-color: var(--primary-color); }
    
    .actions { display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 20px; }
    .btn-cancel { background: var(--card-bg-light); border: 1px solid var(--border-color); color: var(--text-dark); padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .btn-save { background: #10b981; color: var(--text-light); border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    .btn-save:disabled { opacity: 0.6; }

    .table-container { background: var(--card-bg-light); border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
    .table-responsive { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 800px; }
    th { background: var(--background-light); text-align: left; padding: 15px 20px; color: var(--text-muted); font-weight: 600; font-size: var(--font-size-sm); border-bottom: 1px solid var(--border-color); }
    td { padding: 15px 20px; border-bottom: 1px solid var(--border-color); font-size: var(--font-size-base); color: var(--text-dark); }
    tr:last-child td { border-bottom: none; }
    
    .org-avatar { width: 32px; height: 32px; background: var(--primary-color); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    
    .contact-info { display: flex; flex-direction: column; gap: 4px; }
    .contact-info span { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); color: var(--text-muted); }
    .contact-info .material-icons { font-size: 16px; }

    .badge { padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .badge.inactive { background: rgba(100, 116, 139, 0.1); color: #64748b; }

    .action-buttons { display: flex; gap: 8px; }
    .action-btn { background: none; border: none; cursor: pointer; font-weight: 500; font-size: var(--font-size-sm); padding: 6px; border-radius: 6px; }
    .action-btn .material-icons { font-size: 18px; vertical-align: middle; }
    .action-btn.edit { color: var(--primary-color); background: rgba(59, 130, 246, 0.1); }
    .action-btn.delete { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
    .empty-state { text-align: center; color: var(--text-muted); padding: 30px; }

    @media (max-width: 640px) {
      .header-actions { flex-direction: column; align-items: stretch; }
      .header-actions h2 { font-size: var(--font-size-xl); }
      .form-card { padding: 20px; }
      .table-responsive { border-radius: 12px; }
    }
  `]
})
export class OrganizationListComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  organizations: any[] = [];
  showForm = false;
  isEditing = false;
  currentEditId: number | null = null;

  orgForm = this.fb.group({
    name: ['', Validators.required],
    address: [''],
    email: ['', Validators.email],
    phone: [''],
    isActive: [true]
  });

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.api.getOrganizations().subscribe(res => this.organizations = res);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.orgForm.reset({ isActive: true });
      this.isEditing = false;
      this.currentEditId = null;
    }
  }

  editOrg(org: any) {
    this.isEditing = true;
    this.currentEditId = org.id;
    this.orgForm.patchValue({
      name: org.name,
      address: org.address,
      email: org.email,
      phone: org.phone,
      isActive: org.isActive
    });
    this.showForm = true;
  }

  saveOrg() {
    if (this.orgForm.invalid) return;

    if (this.isEditing && this.currentEditId) {
      this.api.updateOrganization(this.currentEditId, this.orgForm.value).subscribe(() => {
        this.loadOrganizations();
        this.toggleForm();
      });
    } else {
      this.api.createOrganization(this.orgForm.value).subscribe(() => {
        this.loadOrganizations();
        this.toggleForm();
      });
    }
  }

  deleteOrg(id: number) {
    if (confirm('Are you sure you want to delete this organization?')) {
      this.api.deleteOrganization(id).subscribe({
        next: () => this.loadOrganizations(),
        error: (err: any) => alert(err.error || 'Failed to delete')
      });
    }
  }
}
