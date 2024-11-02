import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Alert } from '../models/alert.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthAlertsService {

  private apiUrl = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) {}

  //Obtener todas las health alerts de los pacientes de un caregiver segun su id
  getHealthAlertsByCaregiverId(id: string): Observable<Alert[]> {
    return this.http.get<any>(`${this.apiUrl}/caregiver/${id}`).pipe(
      map(response => {
        if (response.status === 'success' && response.data) { 
          return response.data; // Retornar solo las alertas de salud
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
