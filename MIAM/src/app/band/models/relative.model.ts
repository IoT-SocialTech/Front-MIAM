import { Account } from "./account.model";

export interface Relative {
    id: number;
    name: string;
    lastName: string;
    relationship: string;
    account: Account;
  }