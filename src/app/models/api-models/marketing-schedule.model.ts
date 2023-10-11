import { FileHandle } from "../ui-models/FileHandle";

import { Cycle } from "./cycle.model";
import { Approval } from "../ui-models/approval.model";
import { apiCampaign } from "./campaign.model";

export interface MarketingSchedule {
    id: number;
    cycle: Cycle;
    scheduleVersion: string;
    isCurrentVersion: boolean;
    updatedBy: string;
    updateDate: string;
    updateDescription: string;
    approval: Approval;
    campaigns: apiCampaign[];
}