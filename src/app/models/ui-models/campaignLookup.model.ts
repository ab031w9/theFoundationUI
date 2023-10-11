import { FileHandle } from "./FileHandle";
import { Address } from "../api-models/address.model";
import { MarketingScreen } from "../api-models/marketing-screen.model";
import { MarketingType } from "../api-models/marketing-type.model";
import { MarketingChannel } from "../api-models/marketing-channel.model";
import { Language } from "../ui-models/language.model";

export interface campaignLookup {
   
        marketingScreens: MarketingScreen[],
        marketingChannels: MarketingChannel[],
        languages: Language[]
}