import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicationAlertsService } from '../../../services/medication-alerts.service';

@Component({
  selector: 'app-medication-alert-form',
  templateUrl: './medication-alert-form.component.html',
  styleUrls: ['./medication-alert-form.component.css']
})
export class MedicationAlertFormComponent {
  alertForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MedicationAlertFormComponent>,
    private medicationAlertsService: MedicationAlertsService,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: number, caregiverId: number }
  ) {
    // Inicializamos el formulario con validaciones
    this.alertForm = this.fb.group({
      medicationName: ['', Validators.required],
      dose: [0, [Validators.required, Validators.min(1)]],
      hour: ['', Validators.required], 
      taken: [false, Validators.required],
      patientId: [data.patientId, Validators.required], 
    caregiverId: [data.caregiverId, Validators.required]
    });
  }

  // Método para enviar el formulario y cerrar el modal
  submitForm() {
    if (this.alertForm.valid) {
      // Construimos el objeto en el formato que necesita la API
      const alertData = {
        medicationName: this.alertForm.value.medicationName,
        dose: this.alertForm.value.dose,
        hour: this.alertForm.value.hour + ':00', 
        taken: this.alertForm.value.taken,
        patientId: this.data.patientId,
        caregiverId: this.data.caregiverId,
      };
  
      // Llamamos al servicio para guardar la alerta
      this.medicationAlertsService.createMedicationAlert(alertData).subscribe({
        next: (response) => {
          console.log('Alerta guardada con éxito:', response);
          this.dialogRef.close(response); // Cerramos el modal con la respuesta
        },
        error: (error) => {
          console.error('Error saving medication alert:', error);
          alert('Error saving medication alert. Please try again.');
        },
      });
    } else {
      alert('Please fill all the information.');
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
