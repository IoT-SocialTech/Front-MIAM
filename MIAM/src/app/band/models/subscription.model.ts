import { Plan } from "./plan.model";

export interface Subscription {
    id: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    type: string;
    plan: Plan;
}