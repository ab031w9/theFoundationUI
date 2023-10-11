import { ATMDetails } from "./atm-details.model";
import { apiCampaign } from "./campaign.model";

export interface ATMTarget {
    isTargetRegion: boolean;
    targetRegionOrAtm: string;
}