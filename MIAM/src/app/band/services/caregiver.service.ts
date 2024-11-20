import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaregiverService {
  private apiUrl = `${environment.apiUrl}/miam/cloudApi/caregivers`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`, 
      });
    }
    return new HttpHeaders(); 
  }

  //Obtener un caregiver por accountId
  getCaregiverByAccountId(accountId: string): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/account/${accountId}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error fetching caregiver');
        }
      })
    );
  }
}
