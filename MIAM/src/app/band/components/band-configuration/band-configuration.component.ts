import { Component } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';

@Component({
  selector: 'app-band-settings',
  templateUrl: './band-configuration.component.html',
  styleUrls: ['./band-configuration.component.css']
})
export class BandConfigurationComponent {
  patients: Patient[] = [];
  selectedPatient?: Patient;

  constructor(private patientCaregiverService: PatientCaregiverService) {}

  ngOnInit(): void {
    this.getPatients();
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

  // Seleccionar un paciente
  selectPatient(patient: Patient): void {
    this.selectedPatient = { ...patient }; // Clonar objeto para evitar modificaciones directas
  }
  
}
 