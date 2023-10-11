import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { apiCampaign } from '../models/api-models/campaign.model';
import { CreateCampaignApprovalRequestModel } from '../models/api-models/create-campaign-approval-request.model';
import { UpdateCampaignApprovalRequestModel } from '../models/api-models/update-campaign-approval-request.model';
import { campaignLookup } from '../models/ui-models/campaignLookup.model';
import { CampaignHistory } from "../models/api-models/campaign-history.model";
import { Approval } from 'src/app/models/ui-models/approval.model';
import { apiApproval } from '../models/api-models/approval.model';



@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  private baseApiUrl = environment.campaignBaseApiUrl;

  constructor(private httpClient: HttpClient) {

  }

  getApprovals(): Observable<Approval[]>{
    return this.httpClient.get<Approval[]>(this.baseApiUrl + '/Approval');
  }


  getCampaignApproval(ApprovalId: string): Observable<Approval>{
    return this.httpClient.get<Approval>(this.baseApiUrl + '/Approval/' + ApprovalId);
  }

  createCampaignApprovals(requestBody: apiApproval): Observable<apiApproval>{
    const createCampaignApprovalRequest: CreateCampaignApprovalRequestModel = {
      campaignId: requestBody.campaignId,   
      approvalTime: requestBody.approvalTime,
      approvedBy: requestBody.approvedBy
}

    return this.httpClient.post<apiApproval>(this.baseApiUrl + '/Approval/', createCampaignApprovalRequest);

  }

  updateCampaign(ApprovalId: string, requestBody: apiApproval): Observable<Approval>{
    const updateCampaignApprovalRequest: UpdateCampaignApprovalRequestModel = {
      campaignId: requestBody.campaignId,   
      approvalTime: requestBody.approvalTime,
      approvedBy: requestBody.approvedBy
    }

    return this.httpClient.put<Approval>(this.baseApiUrl + '/Approval/' + ApprovalId, updateCampaignApprovalRequest);

  }

  deleteCampaignApproval(ApprovalId: string): Observable<Approval>{

    return this.httpClient.delete<Approval>(this.baseApiUrl + '/Approval/' + ApprovalId);

  }

}
