import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CaregiverService } from 'src/app/band/services/caregiver.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private caregiverService: CaregiverService
  ) { }

  login(email: string, password: string): Observable<boolean> {
    console.log('Login attempt:', { email, password });
  
    // Primera solicitud: enviar email y contraseña al endpoint de login
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      switchMap(response => {
        console.log('Login response:', response);
  
        if (response.status === 'SUCCESS' && response.data) {
          const account = response.data;
  
          console.log('Login successful:', account);
  
          const token = account.token;
          const accountId = account.id;

          localStorage.setItem('token', token.toString());
          console.log('Token saved in localStorage.');

          localStorage.setItem('accountId', accountId.toString());
          console.log('Account id saved in localStorage.');

          // Segunda solicitud: obtener el id del caregiver
          return this.caregiverService.getCaregiverByAccountId(accountId).pipe(
            map(caregiver => {
              console.log('Caregiver:', caregiver);
              localStorage.setItem('caregiverId', caregiver.id.toString());
              console.log('Caregiver saved in localStorage.');
              this.isAuthenticated = true;
              return true;
            }),
            catchError(caregiverError => {
              this.isAuthenticated = false;
              console.error('Caregiver error:', caregiverError);
              return of(false);
            })
          );

        } else {
          this.isAuthenticated = false;
          console.error('Login failed: Invalid response.');
          return of(false); 
        }
      }),
      catchError(loginError => {
        this.isAuthenticated = false;
        console.error('Login error:', loginError);
        return of(false); 
      })
    );
  }
  

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']);
  }

  
}
