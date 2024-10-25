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
  displayedAlerts: any[] = [];
  selectedCaregiver: string | null = null;
  
  caregivers = [
    { value: 'caregiver1', viewValue: 'John Doe' },
    { value: 'caregiver2', viewValue: 'Anna Smith' },
    { value: 'caregiver3', viewValue: 'Carolina Suarez' }
  ];

  selectedRelative: string | null = null;
  relatives = [
    { value: 'relative1', viewValue: 'Michael Johnson' },
    { value: 'relative2', viewValue: 'Maria Perez' },
    { value: 'relative3', viewValue: 'Carlos Diaz' }
  ];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.getPatients();
  }

  transformAlerts() {
    if (this.selectedPatient?.medication_alerts) { 
      this.displayedAlerts = this.selectedPatient.medication_alerts.flatMap(alert => {
        return alert.schedule.map((time) => ({
          medication: alert.medication,
          dose: alert.dose,
          frequency: alert.frequency,
          nextDose: time 
        }));
      });
      console.log(this.displayedAlerts); // Para verificar los datos
    } else {
      this.displayedAlerts = []; 
    }
  }

  editAlert(alert: any) {
    console.log('Editing alert', alert);
  }

  deleteAlert(alert: any) {
    console.log('Deleting alert', alert);
  }
  
  onCaregiverSelected(caregiver: string) {
    console.log('Selected caregiver:', caregiver);
  }

  onRelativeSelected(relative: string) {
    console.log('Selected relative:', relative);
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
    this.transformAlerts();
  }

  // Guardar paciente (actualizar o agregar)
  /*
  savePatient(): void {
    if (this.selectedPatient) {
      // Asegurarnos de que todos los campos requeridos estén definidos
      const updatedPatient: Patient = {
        id: this.selectedPatient.id || '', // Valor predeterminado para evitar undefined
        name: this.selectedPatient.name || '', // Valor predeterminado para evitar undefined
        lastname: this.selectedPatient.lastname || '', // Valor predeterminado para evitar undefined
        birthdate: this.selectedPatient.birthdate || 0, // Valor predeterminado para evitar undefined
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
*/
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
