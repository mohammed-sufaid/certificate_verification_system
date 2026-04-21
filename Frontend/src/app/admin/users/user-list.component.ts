import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="header-actions">
      <h2>Manage Users</h2>
      <button class="btn-primary" (click)="toggleForm()">
        <span class="material-icons" style="font-size:18px; margin-right:4px; vertical-align:-3px;">person_add</span> Add User
      </button>
    </div>

    <!-- Create/Edit Form Modal/Card -->
    <div class="form-card" *ngIf="showForm">
      <h3>{{ isEditing ? 'Edit User' : 'Create User' }}</h3>
      <form [formGroup]="userForm" (ngSubmit)="saveUser()">
        <div class="row">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="user@example.com" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select formControlName="roleId">
              <option *ngFor="let role of roles" [ngValue]="role.id">{{ role.name }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="form-group">
            <label>Password {{ isEditing ? '(Optional - leave blank to keep)' : ''}}</label>
            <input type="password" formControlName="password" placeholder="••••••••" />
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn-cancel" (click)="toggleForm()">Cancel</button>
          <button type="submit" class="btn-save" [disabled]="userForm.invalid">Save user</button>
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
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody *ngIf="users.length > 0; else noData">
            <tr *ngFor="let u of users">
              <td>#{{ u.id }}</td>
              <td><strong>{{ u.email }}</strong></td>
              <td><span class="badge">{{ u.role }}</span></td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" (click)="editUser(u)">
                    <span class="material-icons">edit</span>
                  </button>
                  <button class="action-btn delete" *ngIf="u.email !== currentEmail" (click)="deleteUser(u.id)">
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <ng-template #noData>
            <tbody><tr><td colspan="4" class="empty-state">No users found.</td></tr></tbody>
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
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
    .form-group label { display: block; margin-bottom: 8px; font-size: var(--font-size-sm); color: var(--text-muted); font-weight: 500;}
    .form-group input, .form-group select { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: var(--font-size-base); outline: none; }
    .form-group input:focus, .form-group select:focus { border-color: var(--primary-color); }
    
    .actions { display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 20px; }
    .btn-cancel { background: var(--card-bg-light); border: 1px solid var(--border-color); color: var(--text-dark); padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .btn-save { background: #10b981; color: var(--text-light); border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;}
    .btn-save:disabled { opacity: 0.6; }

    .table-container { background: var(--card-bg-light); border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border-color); }
    .table-responsive { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th { background: var(--background-light); text-align: left; padding: 15px 20px; color: var(--text-muted); font-weight: 600; font-size: var(--font-size-sm); border-bottom: 1px solid var(--border-color); }
    td { padding: 15px 20px; border-bottom: 1px solid var(--border-color); font-size: var(--font-size-base); color: var(--text-dark); }
    tr:last-child td { border-bottom: none; }
    
    .badge { background: rgba(59, 130, 246, 0.1); color: var(--primary-color); padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 600;}
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
    }
  `]
})
export class UserListComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  users: any[] = [];
  roles: any[] = [{ id: 1, name: 'Admin' }, { id: 2, name: 'Organization' }];
  showForm = false;
  isEditing = false;
  currentEditId: number | null = null;
  currentEmail = '';

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    roleId: [1, Validators.required]
  });

  ngOnInit() {
    this.api.currentUser.subscribe(u => this.currentEmail = u?.email || '');
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe(res => this.users = res);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.userForm.reset({ roleId: 1 });
      this.userForm.get('password')?.setValidators(Validators.required);
      this.userForm.get('password')?.updateValueAndValidity();
      this.isEditing = false;
      this.currentEditId = null;
    } else {
      if(!this.isEditing) {
        this.userForm.get('password')?.setValidators(Validators.required);
      } else {
        this.userForm.get('password')?.clearValidators();
      }
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  editUser(u: any) {
    this.isEditing = true;
    this.currentEditId = u.id;
    this.userForm.patchValue({ email: u.email, roleId: u.role === 'Admin' ? 1 : 2, password: '' });
    this.showForm = true;
  }

  saveUser() {
    if (this.userForm.invalid) return;

    if (this.isEditing && this.currentEditId) {
      const payload = { ...this.userForm.value };
      if (!payload.password) delete payload.password;

      this.api.updateUser(this.currentEditId, payload).subscribe(() => {
        this.loadUsers();
        this.toggleForm();
      });
    } else {
      this.api.createUser(this.userForm.value).subscribe(() => {
        this.loadUsers();
        this.toggleForm();
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err: any) => alert(err.error || 'Failed to delete')
      });
    }
  }
}
