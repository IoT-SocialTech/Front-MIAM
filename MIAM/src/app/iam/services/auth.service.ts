import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/accounts`;
  private isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(response => {
        // Verificar que la respuesta tenga la propiedad data
        if (response.status === 'success' && response.data && response.data.length > 0) {
          const account = response.data[0]; // Acceder al primer objeto del array
          if (account.isActive) {
            this.isAuthenticated = true;
            console.log('Login successful');
            // Guardar información relevante en localStorage (sin contraseña)
            localStorage.setItem('caregiverId', account.id.toString());
            return true;
          } else {
            this.isAuthenticated = false;
            console.error('Login failed: Account is inactive.');
            return false;
          }
        } else {
          this.isAuthenticated = false;
          console.error('Login failed: Account does not exist.');
          return false;
        }
      }),
      catchError(error => {
        this.isAuthenticated = false;
        console.error('Login error:', error);
        return of(false);
      })
    );
  }
  

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('caregiverId'); // Limpiar localStorage al cerrar sesión
    this.router.navigate(['/login']);
  }
}
