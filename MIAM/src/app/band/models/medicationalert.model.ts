import { Time } from "@angular/common";

export interface MedicationAlert {
    id: number;
    medicationName: string;   
    dosage: string;        
    scheduleTime: string;    
    taken: boolean;  
    Patient_id: number;
}
