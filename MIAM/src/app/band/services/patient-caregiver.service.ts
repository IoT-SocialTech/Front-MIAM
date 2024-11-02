import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Patient } from '../models/patient.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Caregiver } from '../models/caregiver.model';

@Injectable({
  providedIn: 'root'
})
export class PatientCaregiverService {

  private apiUrl = `${environment.apiUrl}/patientCaregivers`;

  constructor(private http: HttpClient) {}

  // Obtener todos los pacientes de un caregiver según su ID
  getPatientsByCaregiverId(id: string): Observable<Patient[]> {
    return this.http.get<any>(`${this.apiUrl}/caregiver/${id}`).pipe(
      map(response => {
        if (response.status === 'success' && response.data && response.data.patients) {
          return response.data.patients; 
        } else {
          throw new Error('No patients found'); 
        }
      }),
      catchError(this.handleError)
    );
  }

  getCaregiverByPatientId(patientId: string): Observable<Caregiver> {
    return this.http.get<any>(`${this.apiUrl}/patient/${patientId}`).pipe(
      map(response => {
        if (response.status === 'success' && response.data && response.data.caregiver) {
          return response.data.caregiver; 
        } else {
          throw new Error('No caregiver found');
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
