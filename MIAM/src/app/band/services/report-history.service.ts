import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportHistoryService {
  private apiUrl = `${environment.apiUrl}/miam/cloudApi/reportHistories`;

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

  getReportsByCaregiverId(caregiverId: string) : Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/caregiver/${caregiverId}`, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('No reports found');
        }
      })
    )
  }
}
