import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientCaregiver } from '../../models/patientCaregiver.model';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';
import { FeingClientService } from '../../services/feing-client.service';

@Component({
  selector: 'app-band-settings',
  templateUrl: './band-configuration.component.html',
  styleUrls: ['./band-configuration.component.css']
})
export class BandConfigurationComponent {
  patients: PatientCaregiver[] = [];
  selectedPatient?: PatientCaregiver;
  selectedRelative?: any;  // Se agrega el tipo para el relative
  isLoading: boolean = false;
  selectedPatientIsLoaded: boolean = false;
  bandForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientCaregiverService: PatientCaregiverService,
    private feingClientService: FeingClientService
  ) {}

  ngOnInit(): void {
    this.getPatients();

    // Inicializa bandForm con los valores por defecto
    this.bandForm = this.fb.group({
      caregiverTemperature: [false],
      caregiverTemperatureLimit: [null, Validators.min(0)],
      caregiverPulse: [false],
      caregiverPulseLimit: [null, Validators.min(0)],
      caregiverFall: [false],
    });
  }

  /**
   * Obtiene los pacientes relacionados al caregiver usando el servicio.
   */
  getPatients(): void {
    this.isLoading = true;
    const caregiverId = localStorage.getItem('caregiverId');
    if (caregiverId) {
      this.patientCaregiverService.getPatientsByCaregiverId(caregiverId).subscribe(
        (data) => {
          this.patients = data.map((item: any) => {
            // Aquí agregamos los datos del relative a cada paciente
            const patientWithRelative = { 
              patient: item.patient, 
              caregiver: item.caregiver,
              relative: item.relative 
            };
            return patientWithRelative;
          });
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

  /**
   * Selecciona un paciente y resetea los valores del formulario con los valores predeterminados.
   */
  selectPatient(patient: PatientCaregiver): void {
    this.selectedPatient = { ...patient };  // Asignar datos del paciente
    this.selectedRelative = { ...patient.patient.relative }; // Asignar datos del relative
    this.selectedPatientIsLoaded = true;

    this.bandForm.reset({
      caregiverTemperature: false,
      caregiverTemperatureLimit: null,
      caregiverPulse: false,
      caregiverPulseLimit: null,
      caregiverFall: false,
    });
  }

  /**
   * Método para guardar los límites de alerta configurados.
   */
  save(): void {
    if (this.bandForm.valid && this.selectedPatient) {
      const formData = this.bandForm.value;
      const macAddress = "78:21:84:C9:1F:28"; // MAC address de prueba
      const payload = {
        "limitTemperature": formData.caregiverTemperature ? formData.caregiverTemperatureLimit : 38,
        "limitHeartRate": formData.caregiverPulse ? formData.caregiverPulseLimit : 100,
        "limitDistance": 1 // Distancia predeterminada para caídas
      };

      console.log('Data to send:', payload);

      this.feingClientService.updateDevice(macAddress, payload).subscribe(
        (response) => {
          console.log('Update successful:', response);
        },
        (error) => {
          console.error('Error updating limits:', error);
        }
      );
    } else {
      console.warn('Form is invalid or no patient is selected.');
    }
  }
}
