import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';
import { MedicationAlertsService } from '../../services/medication-alerts.service';
import { MedicationAlertFormComponent } from './medication-alert-form/medication-alert-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientService } from '../../services/patient.service';
import { PatientCaregiver } from '../../models/patientCaregiver.model';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { FeingClientService } from '../../services/feing-client.service';
import * as moment from 'moment-timezone';

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
  temperature: any | null = null;
  heartRate: any | null = null;
  isLoading: boolean = true; 

  constructor(
    private patientCaregiverService: PatientCaregiverService, 
    private medicationAlertService: MedicationAlertsService, 
    private patientService: PatientService,
    private feingClientService: FeingClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPatients();
  }

  // Alertas de medicación

  getPatientMedicationAlerts() {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPatients();
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
    this.isLoading = true; // Activar la animación de carga

    const caregiverId = localStorage.getItem('caregiverId'); 
    console.log('Caregiver ID:', caregiverId);
    if (caregiverId) { 
      this.patientCaregiverService.getPatientsByCaregiverId(caregiverId).subscribe(
        (data) => {
          console.log('Data:', data);
          this.patients = data.map((item: any) =>  ({ patient: item.patient, caregiver: item.caregiver }));
          console.log('Patients:', this.patients);
          this.isLoading = false; 
        },
        (error) => {
          console.error('Error fetching patients:', error);
          this.isLoading = false; 
        }
      );
    } else {
      console.error('No caregiverId found in localStorage.'); 
      this.isLoading = false;
    }
  }

  selectPatient(patient: PatientCaregiver): void {
    if (this.selectedPatient?.patient.id !== patient.patient.id) {
      this.selectedPatient = patient;
      this.patientAge = this.calculateAge(patient.patient.birthDate);
      this.getPatientMedicationAlerts();
      this.loadVitals("1");
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
        this.patientService.addPatient(updatedPatient).subscribe(
          (newPatient) => {
            alert('Patient added successfully.');
          },
          (error) => {
            console.error('Error adding patient:', error);
          }
        );
      }
    }
  }

  loadVitals(patientId: string): void {
    this.feingClientService.getTemperature(patientId).subscribe(
      (temperatureData) => {
        console.log('Temperature data:', temperatureData);
        this.temperature = temperatureData; 
      },
      (error) => {
        console.error('Error fetching temperature:', error);
      }
    );

    this.feingClientService.getHeartRate(patientId).subscribe(
      (heartRateData) => {
        console.log('Heart rate data:', heartRateData);
        this.heartRate = heartRateData; 
      },
      (error) => {
        console.error('Error fetching heart rate:', error);
      }
    );
  }

  formatDateWithMoment(date: string): string {
    return moment(date).tz("America/Lima").format('HH:mm:ss DD/MM/YYYY');
  }
}
