import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  { path: '', redirectTo: 'verify', pathMatch: 'full' },
  { path: 'verify', loadComponent: () => import('./public/verify/verify.component').then(m => m.VerifyComponent) },
  { path: 'auth/login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },

  // Secure Admin Area
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'organizations', loadComponent: () => import('./admin/organizations/organization-list.component').then(m => m.OrganizationListComponent) },
      { path: 'users', loadComponent: () => import('./admin/users/user-list.component').then(m => m.UserListComponent) },
      { path: 'certificates', loadComponent: () => import('./admin/certificates/certificate-list.component').then(m => m.CertificateListComponent) },
      { path: 'settings', loadComponent: () => import('./admin/settings/settings.component').then(m => m.SettingsComponent) }
    ]
  }
];
