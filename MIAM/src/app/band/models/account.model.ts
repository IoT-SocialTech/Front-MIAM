import { Role } from "./role.model";

export interface Account {
    id: number;
    email: string;
    phoneNumber: number; 
    isActive: boolean;
    createdAt: string;
    role: Role;
  }