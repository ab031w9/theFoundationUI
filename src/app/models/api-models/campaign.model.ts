import { FileHandle } from "../ui-models/FileHandle";

import { CampaignHistory } from "./campaign-history.model";
import { MarketingScreen } from "./marketing-screen.model";
import { MarketingChannel } from "./marketing-channel.model";
import { MarketingImage } from "./marketing-image.model";
import { ATMTarget } from "./atm-target.model";

export interface apiCampaign {
    id: number;
    campaignId: string;
    campaignName: string;
    campaignBy: string;
    lastUpdate: CampaignHistory;
    updatedBy: string;
    screen: MarketingScreen;
    marketingChannel: MarketingChannel;
    campaignStartDate: Date;
    campaignEndDate: Date;
    imageList: MarketingImage[];
    isActive: boolean;
    isApproved: boolean;
    version: string;
    isTargetted: boolean;
    targetData: ATMTarget;

}