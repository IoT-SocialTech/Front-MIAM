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

  private apiUrl = `${environment.apiUrl}/patients.json`;

  constructor(private http: HttpClient) {}

  // Obtener todos los pacientes
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un paciente por ID
  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo paciente
  addPatient(patient: Patient): Observable<Patient> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Patient>(this.apiUrl, patient, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un paciente existente
  updatePatient(patient: Patient): Observable<Patient> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un paciente
  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('An error occurred', error); // for demo purposes only
    return throwError(error.message || 'Something went wrong');
  }
}
