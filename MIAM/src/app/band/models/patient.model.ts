import { Account } from "./account.model";
import { HeartRate } from "./heartrate.model";
import { MedicationAlert } from "./medicationalert.model";
import { Relative } from "./relative.model";
import { Temperature } from "./temperature.model";

export interface Patient {
  id: string;
  name: string;
  lastName: string;
  birthDate: string; 
  address: string;
  relative: Relative;
  account: Account;
}
