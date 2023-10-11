import { FileHandle } from "./FileHandle";
import { CampaignHistory } from "../api-models/campaign-history.model";
import { MarketingScreen } from "../api-models/marketing-screen.model";
import { MarketingChannel } from "../api-models/marketing-channel.model";
import { MarketingType } from "../api-models/marketing-type.model";

export interface Campaign {
          id: Number,
          campaignId: string,
          campaignName: string,
          campaignBy: string,
          screen: MarketingScreen,
          channel: MarketingChannel,
          campaignStartDate: string,
          campaignEndDate: string,
          imageList: [
           FileHandle
          ]
    
}

