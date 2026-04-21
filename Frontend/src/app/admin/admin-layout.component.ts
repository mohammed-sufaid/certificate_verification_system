import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../services/api.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <!-- Backdrop for mobile -->
      <div class="sidebar-backdrop" *ngIf="isSidebarOpen" (click)="toggleSidebar()"></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="isSidebarOpen">
        <div class="brand">
          <div class="logo"></div>
          <h2>Admin Portal</h2>
          <button class="close-mobile-menu" (click)="toggleSidebar()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <nav class="nav-links">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item" (click)="closeSidebarOnMobile()">
            <span class="material-icons icon">dashboard</span> Dashboard
          </a>
          <a routerLink="/admin/organizations" routerLinkActive="active" class="nav-item" (click)="closeSidebarOnMobile()">
            <span class="material-icons icon">business</span> Organizations
          </a>
          <a routerLink="/admin/certificates" routerLinkActive="active" class="nav-item" (click)="closeSidebarOnMobile()">
            <span class="material-icons icon">military_tech</span> Certificates
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item" (click)="closeSidebarOnMobile()">
            <span class="material-icons icon">groups</span> Users
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active" class="nav-item" (click)="closeSidebarOnMobile()">
            <span class="material-icons icon">settings</span> Settings
          </a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <header class="top-header">
          <div class="header-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <span class="material-icons">menu</span>
            </button>
            <div class="page-title">Management</div>
          </div>
          
          <div class="user-box">
            <div class="user-info">
              <span class="user-role">{{ $any(currentUser$ | async)?.role }}</span>
              <span class="user-email">{{ $any(currentUser$ | async)?.email }}</span>
            </div>
            <button class="btn-logout" (click)="logout()" title="Logout">
              <span class="material-icons">logout</span>
              <span class="logout-text">Logout</span>
            </button>
          </div>
        </header>

        <section class="content-wrapper">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: var(--background-light);
      font-family: 'Inter', sans-serif;
    }

    /* Sidebar Styles */
    .sidebar {
      width: 260px;
      background: var(--card-bg-light);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 0;
      transition: transform 0.3s ease;
      z-index: 1000;
    }
    
    .brand {
      padding: 30px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }
    
    .brand .logo {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      border-radius: 8px;
    }
    
    .brand h2 {
      margin: 0;
      font-size: var(--font-size-xl);
      color: var(--text-dark);
      font-weight: 700;
    }

    .close-mobile-menu {
      display: none;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      position: absolute;
      right: 15px;
    }

    .nav-links {
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: var(--font-size-md);
      transition: background 0.2s, color 0.2s;
    }

    .nav-item .icon { font-size: 20px; }

    .nav-item.active {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary-color);
    }
    .nav-item.active .icon { color: var(--primary-color); }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .top-header {
      height: 70px;
      background: var(--card-bg-light);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--text-dark);
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
    }

    .page-title {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-dark);
    }

    .user-box {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-role {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary-color);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    .user-email {
      color: var(--text-muted);
      font-size: var(--font-size-base);
      font-weight: 500;
    }

    .btn-logout {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: var(--font-size-base);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-logout .material-icons { font-size: 18px; }

    .content-wrapper {
      flex: 1;
      padding: 30px;
      overflow-y: auto;
      background: var(--background-light);
    }

    /* Responsive Queries */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        box-shadow: 10px 0 30px rgba(0,0,0,0.1);
      }
      .sidebar.open { transform: translateX(0); }
      
      .sidebar-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        z-index: 999;
      }

      .close-mobile-menu { display: block; }
      .menu-toggle { display: block; }
      
      .top-header { padding: 0 15px; }
      .page-title { font-size: var(--font-size-lg); }
      
      .user-email { display: none; }
      .logout-text { display: none; }
      .btn-logout { padding: 6px; }
      
      .content-wrapper { padding: 15px; }
    }
  `]
})
export class AdminLayoutComponent {
  api = inject(ApiService);
  router = inject(Router);

  currentUser$ = this.api.currentUser;
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/auth/login']);
  }
}
