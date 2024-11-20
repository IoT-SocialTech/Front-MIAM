import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/miam/cloudApi/accounts`;

  constructor(private http: HttpClient) { }

  // Método para obtener los encabezados con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`, 
      });
    }
    return new HttpHeaders(); 
  }

  createAccount(account: any): Observable<Account> {
    return this.http.post<any>(this.apiUrl, account, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error creating account');
        }
      }),
      catchError(error => {
        console.error('Error creating account:', error);
        return of({} as Account);
      })
    );
  }

  // Obtener account por id
  getAccountById(id: number): Observable<Account> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error fetching account');
        }
      }),
      catchError(error => {
        console.error('Error fetching account:', error);
        return of({} as Account);
      })
    );
  }
}
