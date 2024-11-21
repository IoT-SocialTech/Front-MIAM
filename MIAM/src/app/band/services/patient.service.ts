import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Patient } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = `${environment.apiUrl}/miam/cloudApi/patients`;

  constructor(private http: HttpClient) {}

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

  // Obtener todos los pacientes
  getPatients(): Observable<Patient[]> {
    const headers = this.getAuthHeaders(); 
    return this.http.get<Patient[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un paciente por ID
  getPatient(id: string): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(patient => { 
        if (patient) {
          console.log('Patient retrieved successfully', patient);
          return patient.data;
        } else {
          throw new Error('No patient found');
        }
      }
    ),
    ); 
  }

  // Crear un nuevo paciente
  addPatient(patient: any): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post<any>(this.apiUrl, patient, { headers }).pipe(
      map(response => {
      if (response.status === 'success' && response.data) { 
        console.log('Patient retrieved successfully');
        return response.data;
      
      } else {
        throw new Error('No patient found');
      }
    }),
    catchError(this.handleError)
  );  
  }

  // Actualizar un paciente existente
  updatePatient(patient: Patient): Observable<Patient> {
    const headers = this.getAuthHeaders(); 
    return this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un paciente
  deletePatient(id: String): Observable<void> {
    const headers = this.getAuthHeaders(); 
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('An error occurred', error); 
    return throwError(error.message || 'Something went wrong');
  }
}
