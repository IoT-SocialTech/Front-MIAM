export interface MedicationAlert {
    id: number;
    medicationName: string;
    dose: number;   
    hour: string;
    taken: boolean;
    patientId: number;   
    caregiverId: number; 
}