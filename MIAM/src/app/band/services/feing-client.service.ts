import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeingClientService {
  private apiUrl = `${environment.apiUrl}/miam-cloud-api`;

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

  //Update device limits
  updateDevice(deviceId: string, data: any) {
    return this.http.post<any>(`${this.apiUrl}/device/${deviceId}`, data, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error updating device');
        }
      })
    );
  }

  //Get temperature
  getTemperature(id: string) {
    return this.http.get<any>(`${this.apiUrl}/metrics/temperature/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error fetching temperature');
        }
      })
    );
  }

  //get Heart rate
  getHeartRate(id: string) {
    return this.http.get<any>(`${this.apiUrl}/metrics/heartRate/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error fetching heart rate');
        }
      })
    );
  }

  //get average temperature
  getAverageTemperature(id: string) {
    return this.http.get<any>(`${this.apiUrl}/metrics/temperature/average/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error fetching average temperature');
        }
      })
    );
  }

  //get average heart rate
  getAverageHeartRate(id: string) {
    return this.http.get<any>(`${this.apiUrl}/metrics/heartRate/average/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data;
        } else {
          throw new Error('Error fetching average heart rate');
        }
      })
    );
  }
}
