import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MedicationAlert } from '../models/medicationalert.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationAlertsService {

  private apiUrl = `${environment.apiUrl}/medicationSchedule`;

  constructor(private http: HttpClient) {}

  //Obtener todas las medicationAlerts según el ID de un paciente
  getMedicationAlertsByPatientId(id: string): Observable<MedicationAlert[]> {
    return this.http.get<any>(`${this.apiUrl}/patient/${id}`).pipe(
      map(response => {
        if (response.status === 'success' && response.data) {
          return response.data; // Retornar solo las alertas de medicación
        } else {
          throw new Error('No medication alerts found'); // Lanzar error si no se encuentran alertas
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
