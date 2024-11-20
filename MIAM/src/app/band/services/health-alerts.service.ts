import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Alert } from '../models/alert.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthAlertsService {

  private apiUrl = `${environment.apiUrl}/miam/cloudApi/alerts`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders();
  }

  getHealthAlertsByCaregiverId(id: string): Observable<Alert[]> {
    return this.http.get<any>(`${this.apiUrl}/caregiver/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'success' && response.data) { 
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
