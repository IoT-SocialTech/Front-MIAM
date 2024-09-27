import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of} from "rxjs";
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
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(accounts => {
        if (accounts.length > 0 && accounts[0].isActive) {
          this.isAuthenticated = true;
          return true;
        } else {
          this.isAuthenticated = false;
          return false;
        }
      }),
      catchError(() => {
        this.isAuthenticated = false;
        return of(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
