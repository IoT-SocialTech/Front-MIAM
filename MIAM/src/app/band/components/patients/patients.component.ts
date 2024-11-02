import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';
import { MedicationAlertsService } from '../../services/medication-alerts.service';
import { Caregiver } from '../../models/caregiver.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient?: Patient;
  patientAge: number | null = null; 
  displayedAlerts: any[] = [];
  selectedCaregiver: Caregiver | null = null;

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

  constructor(private patientCaregiverService: PatientCaregiverService, private medicationAlertService: MedicationAlertsService) {}

  ngOnInit(): void {
    this.getPatients();
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
    const caregiverId = localStorage.getItem('caregiverId'); 
    console.log('Caregiver ID:', caregiverId);
    if (caregiverId) { 
      this.patientCaregiverService.getPatientsByCaregiverId(caregiverId).subscribe(
        (data) => {
          this.patients = data; 
        },
        (error) => {
          console.error('Error fetching patients:', error);
        }
      );
    } else {
      console.error('No caregiverId found in localStorage.'); 
    }
  }

  getPatientMedicationAlerts(patient: Patient) {
    this.medicationAlertService.getMedicationAlertsByPatientId(patient.id).subscribe(
      (data) => {
        this.displayedAlerts = data; 
        this.selectPatient(patient); 
      },
      (error) => {
        console.error('Error fetching medication alerts:', error);
      }
    );
  }

  selectPatient(patient: Patient): void {
    if (this.selectedPatient?.id !== patient.id) { // Solo si el paciente es diferente
      this.selectedPatient = { ...patient }; // Clonar objeto para evitar modificaciones directas
      this.getPatientMedicationAlerts(patient);
      this.patientAge = this.calculateAge(patient.birthDate);
      this.loadCaregiverForPatient(patient.id);
    }
  }

  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
  
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
  
    // Ajustar la edad si no ha llegado el cumpleaños este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  loadCaregiverForPatient(patientId: string): void {
    this.patientCaregiverService.getCaregiverByPatientId(patientId).subscribe(
      (response) => {
        if (response) {
          this.selectedCaregiver = response;
        }
      },
      (error) => {
        console.error('Error loading caregiver', error);
        this.selectedCaregiver = null;
      }
    );
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
/*
  // Eliminar paciente
  deletePatient(patient: Patient): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientCaregiverService.deletePatient(patient.id).subscribe(
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
  }*/
}
