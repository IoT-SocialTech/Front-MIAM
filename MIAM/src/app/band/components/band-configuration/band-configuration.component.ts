import { Component } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-band-settings',
  templateUrl: './band-configuration.component.html',
  styleUrls: ['./band-configuration.component.css']
})
export class BandConfigurationComponent {
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
  
}
 