import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from 'src/app/band/services/patient.service';
import { RelativeService } from 'src/app/band/services/relative.service';
import { AccountService } from 'src/app/band/services/account.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent {
  patientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private accountService: AccountService,
    private relativeService: RelativeService,
    public dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    // Inicializamos los formularios
    this.patientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      birthdate: ['', Validators.required],
      relativeEmail: ['', [Validators.required, Validators.email]],
      relativePhoneNumber: ['', Validators.required],
      relativeName: ['', Validators.required],
      relativeLastName: ['', Validators.required],
      relationship: ['', Validators.required],
    });

  }

  createRelative(): Promise<number> {
    return new Promise((resolve, reject) => {
      // Datos de la cuenta del familiar
      const relativeAccountData = {
        email: this.patientForm.value.relativeEmail,
        password: 'Pass123.', // Contraseña fija para el familiar
        phoneNumber: this.patientForm.value.relativePhoneNumber,
        subscription: 1, // Suscripción fija
        role: 3, // Rol fijo para el familiar
        active: true
      };
  
      // Crear cuenta para el familiar
      this.accountService.createAccount(relativeAccountData).subscribe(
        (relativeAccountResponse) => {
          const relativeAccountId = relativeAccountResponse.id;
          console.log('Cuenta del familiar creada con éxito:', relativeAccountId);
  
          // Crear al familiar
          const newRelative = {
            name: this.patientForm.value.relativeName,
            lastName: this.patientForm.value.relativeLastName,
            relationship: this.patientForm.value.relationship,
            account: relativeAccountId
          };
  
          this.relativeService.createRelative(newRelative).subscribe(
            (relativeResponse) => {
              console.log('Familiar creado con éxito:', relativeResponse);
              console.log('ID del familiar:', relativeResponse.id);
              alert('Familiar creado con éxito');
              resolve(relativeResponse.id); // Devuelve el ID del familiar
            },
            (error) => {
              console.error('Error al crear el familiar:', error);
              alert('Ocurrió un error al crear el familiar.');
              reject(error); // Manejo de errores al crear el familiar
            }
          );
        },
        (error) => {
          console.error('Error al crear la cuenta del familiar:', error);
          alert('Ocurrió un error al crear la cuenta del familiar.');
          reject(error); // Manejo de errores al crear la cuenta
        }
      );
    });
  }
  

  createPatient(): void {
    if (this.patientForm.invalid) {
      return;
    }
  
    // Crear cuenta para el paciente
    const patientAccountData = {
      email: this.patientForm.value.email,
      password: 'Pass123.', // Contraseña fija
      phoneNumber: this.patientForm.value.phoneNumber,
      subscription: 1, // Suscripción fija
      role: 1, // Rol fijo para el paciente
      active: true
    };
  
    this.accountService.createAccount(patientAccountData).subscribe(
      async (accountResponse) => {
        const patientAccountId = accountResponse.id; // id del account del paciente
        
        try {
          const relativeId = await this.createRelative(); // Esperamos a que el familiar sea creado
          console.log('Recuperando ID del familiar:', relativeId);

          // Crear al paciente
          const newPatient = {
            name: this.patientForm.value.name,
            lastName: this.patientForm.value.lastName,
            address: this.patientForm.value.address,
            birthdate: this.patientForm.value.birthdate,
            account: patientAccountId,
            relative: relativeId,
            caregiverIds: [
              this.data.caregiverId
            ]
          };
  
          this.patientService.addPatient(newPatient).subscribe(
            (patientResponse) => {
              console.log('Paciente creado con éxito', patientResponse);
              alert('Paciente y relativo creados con éxito');
              this.dialogRef.close(); // Cerrar el diálogo después de guardar
            },
            (error) => {
              console.error('Error al crear el paciente', error);
            }
          );
        } catch (error) {
          console.error('Error al crear el familiar', error);
        }
      },
      (error) => {
        console.error('Error al crear el account del paciente', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close(); // Cerrar el diálogo sin hacer nada
  }
}