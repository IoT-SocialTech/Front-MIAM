import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MedicationAlert } from '../models/medicationalert.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationAlertsService {

  private apiUrl = `${environment.apiUrl}/miam/cloudApi/medicationSchedules`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getMedicationAlertsByPatientId(id: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    console.log('Sending request to:', `${this.apiUrl}/patient/${id}`);
    
    return this.http.get<any>(`${this.apiUrl}/patient/${id}`, { headers }).pipe(
      map(response => {
        // Verificar que la respuesta contiene un campo 'status' y 'data'
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; // Retornar las alertas
        } else {
          // Si la respuesta no es exitosa o no hay datos, puedes retornar un array vacío o lanzar un error
          console.error('No medication alerts found or invalid status:', response);
          return []; // Retornar un array vacío si no hay alertas
        }
      }),
      catchError((error) => {
        // Manejar cualquier error que se haya producido durante la solicitud
        console.error('Error fetching medication alerts:', error);
        return of([]); // Retornar un array vacío en caso de error
      })
    );
  }
  

  // Crear una alerta de medicación
  createMedicationAlert(alert: any): Observable<MedicationAlert> {
    const headers = this.getAuthHeaders();

    return this.http.post<any>(this.apiUrl, alert, {headers}).pipe(
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

  editMedicationAlert(id: string, status: boolean): Observable<MedicationAlert> {
    const headers = this.getAuthHeaders(); 
    const body = { "taken": status };
    return this.http.put<any>(`${this.apiUrl}/${id}`, body, { headers }).pipe(
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
