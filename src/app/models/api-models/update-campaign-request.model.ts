import { CampaignHistory } from "./campaign-history.model";
import { MarketingScreen } from "./marketing-screen.model";
import { MarketingChannel } from "./marketing-channel.model";
import { MarketingImage } from "./marketing-image.model";
import { MarketingType } from "../api-models/marketing-type.model";
import { ATMTarget } from "./atm-target.model";

export interface UpdateCampaignRequestModel {
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
  isActive: boolean;
  isApproved: boolean;
  version: string;
  isTargetted: boolean;
  targetData: ATMTarget;
}