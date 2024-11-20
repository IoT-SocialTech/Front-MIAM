import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';
import { MedicationAlertsService } from '../../services/medication-alerts.service';
import { Caregiver } from '../../models/caregiver.model';
import { MedicationAlertFormComponent } from './medication-alert-form/medication-alert-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientService } from '../../services/patient.service';
import { PatientCaregiver } from '../../models/patientCaregiver.model';
import { PatientFormComponent } from './patient-form/patient-form.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: PatientCaregiver[] = [];
  selectedPatient?: PatientCaregiver;
  patientAge: number | null = null; 
  displayedAlerts: any[] = [];
  selectedCaregivers: PatientCaregiver[] = [];

  constructor(
    private patientCaregiverService: PatientCaregiverService, 
    private medicationAlertService: MedicationAlertsService, 
    private patientService: PatientService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPatients();
  }

  // Alertas de medicación

  getPatientMedicationAlerts(){
    if (this.selectedPatient)  {
      console.log('Fetching medication alerts for patient:', this.selectedPatient.patient.id);
      this.medicationAlertService.getMedicationAlertsByPatientId(this.selectedPatient.patient.id).subscribe(
        (data) => {
          this.displayedAlerts = data; 
          console.log('Medication alerts:', this.displayedAlerts);
        },
        (error) => {
          this.displayedAlerts = []; 
          console.error('Error fetching medication alerts:', error);
        }
      );
    }
  }

  openCreateAlert() {
    const dialogRef = this.dialog.open(MedicationAlertFormComponent, {
      width: 'auto',
      data: { 
        patientId: this.selectedPatient?.patient.id,
        caregiverId: localStorage.getItem('caregiverId')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.selectedPatient) {
          this.getPatientMedicationAlerts();
        }
      }
    });
  }

  openCreatePatient(): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '600px', // Tamaño del diálogo
      data: {
        caregiverId: localStorage.getItem('caregiverId')
      } 
    });
  }


  deleteAlert(alert: any) {
    this.medicationAlertService.deleteMedicationAlert(alert.id).subscribe(
      () => {
        this.getPatientMedicationAlerts();
      },
      (error) => {
        console.error('Error deleting medication alert:', error);
      }
    );
  }
  
  onCaregiverSelected(caregiver: string) {
    console.log('Selected caregiver:', caregiver);
  }

  onRelativeSelected(relative: string) {
    console.log('Selected relative:', relative);
  }

  // Pacientes

  getPatients(): void {
    const caregiverId = localStorage.getItem('caregiverId'); 
    console.log('Caregiver ID:', caregiverId);
    if (caregiverId) { 
      this.patientCaregiverService.getPatientsByCaregiverId(caregiverId).subscribe(
        (data) => {
          console.log('Data:', data);
          this.patients = data.map((item: any) =>  ({ patient: item.patient, caregiver: item.caregiver }));
          console.log('Patients:', this.patients);
        },
        (error) => {
          console.error('Error fetching patients:', error);
        }
      );
    } else {
      console.error('No caregiverId found in localStorage.'); 
    }
  }

  selectPatient(patient: PatientCaregiver): void {
    if (this.selectedPatient?.patient.id !== patient.patient.id) {
      this.selectedPatient = patient;
      this.getPatientMedicationAlerts();
      this.patientAge = this.calculateAge(patient.patient.birthDate);
      this.loadCaregiverForPatient(patient.patient.id);
    }
  }

  deletePatient(id: String): void { 
    if (confirm(`You are about to delete patient with id ${id}. Are you sure you want to delete this patient?`)) {
      this.patientService.deletePatient(id).subscribe(
        () => {
          this.patients = this.patients.filter(p => p.patient.id !== id);
          this.selectedPatient = undefined;
          alert('Patient deleted successfully.');
        },
        (error) => {
          console.error('Error deleting patient:', error);
        }
      );
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
          this.selectedCaregivers = response;
        }
      },
      (error) => {
        console.error('Error loading caregiver', error);
        this.selectedCaregivers = [];
      }
    );
  }

 
  savePatient(): void {
    if (this.selectedPatient) {
      // Asegurarnos de que todos los campos requeridos estén definidos
      const updatedPatient: Patient = {
        id: this.selectedPatient.patient.id || '', 
        name: this.selectedPatient.patient.name || '', 
        lastName: this.selectedPatient.patient.lastName || '', 
        birthDate: this.selectedPatient.patient.birthDate || '',
        address: this.selectedPatient.patient.address || '', 
        account: this.selectedPatient.patient.account || 0,
        relative: this.selectedPatient.patient.relative || '',
      };

      if (updatedPatient.id) {
        // Si el paciente ya tiene un ID, actualizarlo
        this.patientService.updatePatient(updatedPatient).subscribe(
          () => {
            const index = this.patients.findIndex(p => p.patient.id === updatedPatient.id);
            if (index !== -1) {
              this.patients[index].patient = updatedPatient;
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
            //this.patients.push(newPatient);
            alert('Patient added successfully.');
          },
          (error) => {
            console.error('Error adding patient:', error);
          }
        );
      }
    }
  }

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
