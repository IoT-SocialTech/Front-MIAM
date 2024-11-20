import { Caregiver } from "./caregiver.model";
import { Patient } from "./patient.model";

export interface PatientCaregiver {
    patient: Patient;
    caregiver: Caregiver;
}