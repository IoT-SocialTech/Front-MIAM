import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient?: Patient;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.getPatients();
  }

  // Obtener la lista de pacientes desde el servicio
  getPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  // Seleccionar un paciente
  selectPatient(patient: Patient): void {
    this.selectedPatient = { ...patient }; // Clonar objeto para evitar modificaciones directas
  }

  // Guardar paciente (actualizar o agregar)
  savePatient(): void {
    if (this.selectedPatient) {
      // Asegurarnos de que todos los campos requeridos estén definidos
      const updatedPatient: Patient = {
        id: this.selectedPatient.id || '', // Valor predeterminado para evitar undefined
        name: this.selectedPatient.name || '', // Valor predeterminado para evitar undefined
        age: this.selectedPatient.age || 0, // Valor predeterminado para evitar undefined
        address: this.selectedPatient.address || '', // Valor predeterminado para evitar undefined
        Account_id: this.selectedPatient.Account_id || 0 // Valor predeterminado para evitar undefined
      };

      if (updatedPatient.id) {
        // Si el paciente ya tiene un ID, actualizarlo
        this.patientService.updatePatient(updatedPatient).subscribe(
          () => {
            const index = this.patients.findIndex(p => p.id === updatedPatient.id);
            if (index !== -1) {
              this.patients[index] = updatedPatient;
              alert('Patient updated successfully.');
            }
          },
          (error) => {
            console.error('Error updating patient:', error);
          }
        );
      } else {
        // Si no tiene ID, agregarlo
        this.patientService.addPatient(updatedPatient).subscribe(
          (newPatient) => {
            this.patients.push(newPatient);
            alert('Patient added successfully.');
          },
          (error) => {
            console.error('Error adding patient:', error);
          }
        );
      }
    }
  }

  // Eliminar paciente
  deletePatient(patient: Patient): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(patient.id).subscribe(
        () => {
          this.patients = this.patients.filter(p => p.id !== patient.id);
          this.selectedPatient = undefined;
          alert('Patient deleted successfully.');
        },
        (error) => {
          console.error('Error deleting patient:', error);
        }
      );
    }
  }
}
