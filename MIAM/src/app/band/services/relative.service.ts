import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class RelativeService {
  private apiUrl = `${environment.apiUrl}/miam/cloudApi/relatives`;

  constructor(private http: HttpClient) { }

  // Obtener los encabezados de autorización
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Crear un familiar
  createRelative(relative: any): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post<any>(this.apiUrl, relative, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; 
        } else {
          throw new Error('No medication alerts found'); 
        }
      }),
      catchError(this.handleError)
    );
  }

  gerRelativeByAccountID(accountID: number): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.get<any>(`${this.apiUrl}/account/${accountID}`, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; 
        } else {
          throw new Error('No medication alerts found'); 
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error); 
    return throwError(error.message || 'Something went wrong');
  }
}