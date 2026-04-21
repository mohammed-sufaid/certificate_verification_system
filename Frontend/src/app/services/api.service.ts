import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:5002/api';

  public currentUser = new BehaviorSubject<any>(null);

  constructor() {
    this.checkLoginStatus();
  }

  public checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.next(JSON.parse(user));
    }
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  // --- Auth ---
  public login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        const userData = { email: res.email, role: res.role, fullName: res.fullName };
        localStorage.setItem('user', JSON.stringify(userData));
        this.currentUser.next(userData);
      })
    );
  }

  // --- Public Verification ---
  public verifyCertificate(certificateNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/verification/${certificateNumber}`);
  }

  // --- Dashboard ---
  public getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`);
  }

  // --- Organizations ---
  public getOrganizations(): Observable<any> { return this.http.get(`${this.baseUrl}/organization`); }
  public getOrganization(id: number): Observable<any> { return this.http.get(`${this.baseUrl}/organization/${id}`); }
  public createOrganization(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/organization`, data); }
  public updateOrganization(id: number, data: any): Observable<any> { return this.http.put(`${this.baseUrl}/organization/${id}`, data); }
  public deleteOrganization(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/organization/${id}`); }

  // --- Users ---
  public getUsers(): Observable<any> { return this.http.get(`${this.baseUrl}/user`); }
  public getUser(id: number): Observable<any> { return this.http.get(`${this.baseUrl}/user/${id}`); }
  public createUser(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/auth/register`, data); }
  public updateUser(id: number, data: any): Observable<any> { return this.http.put(`${this.baseUrl}/user/${id}`, data); }
  public deleteUser(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/user/${id}`); }

  // --- Certificates ---
  public getCertificates(): Observable<any> { return this.http.get(`${this.baseUrl}/certificate`); }
  public createCertificate(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/certificate`, data); }
  public revokeCertificate(id: number): Observable<any> { return this.http.put(`${this.baseUrl}/certificate/${id}/revoke`, {}); }
}
