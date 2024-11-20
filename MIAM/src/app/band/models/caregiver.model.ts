import { Account } from "./account.model";

export interface Caregiver {
    id: number;
    name: string;
    address: string;
    account: Account;
  }