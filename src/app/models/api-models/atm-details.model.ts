import { Region } from "./region.model";
import { MarketingSchedule } from "./marketing-schedule.model";

export interface ATMDetails {
    id: number;
    atmNumber: string;
    region: Region;
    marketingSchedule: MarketingSchedule;
}