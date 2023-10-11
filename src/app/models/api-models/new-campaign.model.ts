import { FileHandle } from "../ui-models/FileHandle";

import { CampaignHistory } from "./campaign-history.model";
import { MarketingScreen } from "./marketing-screen.model";
import { MarketingChannel } from "./marketing-channel.model";
import { MarketingImage } from "./marketing-image.model";
import { ATMTarget } from "./atm-target.model";

export interface newAPICampaign {
    id: number;
    campaignId: string;
    campaignName: string;
    campaignBy: string;
    lastUpdate: CampaignHistory;
    updatedBy: string;
    screenId: number;
    marketingChannelId: number;
    campaignStartDate: Date;
    campaignEndDate: Date;
    imageList: MarketingImage[];
    isActive: boolean;
    isApproved: boolean;
    version: string;
    isTargetted: boolean;
    targetData: ATMTarget;

}