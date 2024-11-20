import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Relative } from '../models/relative.model';
 
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
  createRelative(relative: any): Observable<Relative> {
    const headers = this.getAuthHeaders(); 
    return this.http.post<Relative>(this.apiUrl, relative, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error); 
    return throwError(error.message || 'Something went wrong');
  }
}
