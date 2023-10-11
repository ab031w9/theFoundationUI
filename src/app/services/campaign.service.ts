import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { apiCampaign } from '../models/api-models/campaign.model';
import { CreateCampaignRequestModel } from '../models/api-models/create-campaign-request.model';
import { UpdateCampaignRequestModel } from '../models/api-models/update-campaign-request.model';
import { campaignLookup } from '../models/ui-models/campaignLookup.model';
import { MarketingImage } from "../models/api-models/marketing-image.model";
import { CampaignHistory } from "../models/api-models/campaign-history.model";
import { MarketingScreen } from "../models/api-models/marketing-screen.model";
import { MarketingChannel } from "../models/api-models/marketing-channel.model";
import { newAPICampaign } from '../models/api-models/new-campaign.model';
import { allCampaign } from '../models/api-models/campaign-all.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private baseApiUrl = environment.campaignBaseApiUrl;

  constructor(private httpClient: HttpClient) {

  }

  getCampaigns(): Observable<allCampaign[]>{
    return this.httpClient.get<allCampaign[]>(this.baseApiUrl + '/atmmarketingcampaign');
  }

  getCampaignLookup(): Observable<campaignLookup>{
    return this.httpClient.get<campaignLookup>(this.baseApiUrl + '/CampaignLookup');
  }

  getCampaign(CampaignId: string): Observable<apiCampaign>{
    return this.httpClient.get<apiCampaign>(this.baseApiUrl + '/atmmarketingcampaign/' + CampaignId);
  }

  getCampaignImageList(CampaignId: Number): Observable<MarketingImage[]>{
    return this.httpClient.get<MarketingImage[]>(this.baseApiUrl + '/atmmarketingcampaign/' + CampaignId);
  }

  createCampaign(requestBody: newAPICampaign): Observable<newAPICampaign>{
    const createCampaignRequest: CreateCampaignRequestModel = {
      campaignName: requestBody.campaignName,
      campaignBy: requestBody.campaignBy,
      campaignStartDate: requestBody.campaignStartDate,
      campaignEndDate: requestBody.campaignEndDate,
      marketingChannelId: requestBody.marketingChannelId,
      id: requestBody.id,
      campaignId: requestBody.campaignId,
      screenId: requestBody.screenId,
      imageList: requestBody.imageList,
      lastUpdate: requestBody.lastUpdate,
      updatedBy: requestBody.updatedBy,
      isActive: requestBody.isActive,
      isApproved: requestBody.isApproved,
      version: requestBody.version,
      isTargetted: requestBody.isTargetted,
      targetData: requestBody.targetData
    }

    return this.httpClient.post<newAPICampaign>(this.baseApiUrl + '/ATMMarketingCampaign/', createCampaignRequest);

  }

  updateCampaign(CampaignId: Number): Observable<newAPICampaign>{

    return this.httpClient.put<newAPICampaign>(this.baseApiUrl + '/atmmarketingcampaign/' + CampaignId, null);

  }

  deleteCampaign(CampaignId: string): Observable<apiCampaign>{

    return this.httpClient.delete<apiCampaign>(this.baseApiUrl + '/atmmarketingcampaign/' + CampaignId);

  }

}
