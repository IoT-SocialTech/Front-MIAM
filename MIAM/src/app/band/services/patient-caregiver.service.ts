import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Patient } from '../models/patient.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Caregiver } from '../models/caregiver.model';
import { PatientCaregiver } from '../models/patientCaregiver.model';

@Injectable({
  providedIn: 'root'
})
export class PatientCaregiverService {

  private apiUrl = `${environment.apiUrl}/miam/cloudApi/patientCaregivers`;

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

  // Obtener todos los pacientes de un caregiver según su ID
  getPatientsByCaregiverId(id: string): Observable<PatientCaregiver[]> {
    const headers = this.getAuthHeaders(); 
    console.log('Making request to:', `${this.apiUrl}/caregiver/${id}`);
    return this.http.get<any>(`${this.apiUrl}/caregiver/${id}`, { headers }).pipe(
      map(response => {
        console.log(response);
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; 
        } else {
          throw new Error('No patients found'); 
        }
      }),
      catchError(this.handleError)
    );
  }

  // Obtener caregiver por ID de paciente
  getCaregiverByPatientId(patientId: string): Observable<PatientCaregiver[]> {
    const headers = this.getAuthHeaders(); 
    return this.http.get<any>(`${this.apiUrl}/patient/${patientId}`, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS' && response.data) {
          return response.data; 
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
