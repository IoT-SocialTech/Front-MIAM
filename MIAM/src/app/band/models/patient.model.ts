import { HeartRate } from "./heartrate.model";
import { MedicationAlert } from "./medicationalert.model";
import { Temperature } from "./temperature.model";

export interface Patient {
  id: string;
  name: string;
  lastname: string;
  birthdate: Date;
  address: string;
  account_id: number;
  medication_alerts : MedicationAlert[];
  temperature: Temperature[];
  heartRate: HeartRate[];
}
