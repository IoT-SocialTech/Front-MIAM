import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MedicationAlert } from '../models/medicationalert.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationAlertsService {

  private apiUrl = `${environment.apiUrl}/miam/cloudApi/medicationSchedules`;

  constructor(private http: HttpClient) {}

  // Obtener los encabezados de autorización
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener todas las medicationAlerts según el ID de un paciente
  getMedicationAlertsByPatientId(id: string): Observable<MedicationAlert[]> {
    const headers = this.getAuthHeaders(); 

    return this.http.get<any>(`${this.apiUrl}/patient/${id}`, { headers }).pipe(
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
  
  // Crear una alerta de medicación
  createMedicationAlert(alert: any): Observable<MedicationAlert> {
    const headers = this.getAuthHeaders(); 

    return this.http.post<any>(this.apiUrl, alert, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; 
        } else {
          throw new Error('Error creating medication alert'); 
        }
      }),
      catchError(this.handleError)
    );
  }

  editMedicationAlert(alert: MedicationAlert): Observable<MedicationAlert> {
    const headers = this.getAuthHeaders(); 

    return this.http.put<any>(`${this.apiUrl}/${alert.id}`, alert, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; 
        } else {
          throw new Error('Error editing medication alert'); 
        }
      }),
      catchError(this.handleError)
    );
  }
  
  // Eliminar una alerta de medicación
  deleteMedicationAlert(id: string): Observable<any> {
    const headers = this.getAuthHeaders(); 

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response; 
        } else {
          throw new Error('Error deleting medication alert'); 
        }
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('An error occurred', error); 
    return throwError(error.message || 'Something went wrong');
  }
}
