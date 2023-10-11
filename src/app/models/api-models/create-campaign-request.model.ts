import { MarketingImage } from "./marketing-image.model";
import { CampaignHistory } from "./campaign-history.model";
import { MarketingScreen } from "./marketing-screen.model";
import { MarketingChannel } from "./marketing-channel.model";
import { MarketingType } from "./marketing-type.model";
import { ATMTarget } from "./atm-target.model";

export interface CreateCampaignRequestModel {
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