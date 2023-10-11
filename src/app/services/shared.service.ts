import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { base64StringToBlob } from 'blob-util';
import { Observable, BehaviorSubject } from 'rxjs';
import { apiLogin } from '../models/api-models/login.model';
import { Campaign } from '../models/ui-models/campaign.model';
import { apiCampaign } from '../models/api-models/campaign.model';
import { Router } from '@angular/router';
import { allCampaign } from '../models/api-models/campaign-all.model';
import { ATMData } from '../models/api-models/atm-data.model';
import { ATMDetails } from '../models/api-models/atm-details.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  atms: ATMData[] =  [{
    atmNumber: '',
    serialNumber: '',
    address: '',
    city: '',   
    region: '',
    model: ''
   }];

  apiCampaigns: apiCampaign[] = [{
    id: 0,
    campaignId: 'CN0000006',
          campaignName: 'Purchase Insurance by scanning the QR Code - UI',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: '',
            screenNumber: '',
            channelId: 0
          },
          marketingChannel: {
            id: 0,
            channel: '',
            imageResolution: ''
          },
          campaignStartDate: new Date('2023-01-11T08:00:43'),
          campaignEndDate: new Date('2023-01-15T08:00:43'),
          imageList: [{
            id: 0,
            marketingImage: '',
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 3.5,
            priority: 1
          }],
          lastUpdate : {
            id: 0,
            campaignId: 0,
            updatedDate: new Date('2023-01-11T08:00:43'),
            updatedBy: 'Minenhle Mpulo (ZA)',
            updateDescription: '',
            approvalId: 0
        },
          updatedBy: 'Minenhle Mpulo (ZA)',
          isActive: false,
          isApproved: false,
          isTargetted: false,
            version: '1.0',
          targetData: {
            isTargetRegion: false,
            targetRegionOrAtm: ''
          }

  }];
  value: any = "";
  captureData$: Observable<Campaign | apiCampaign>;
  createCampaignData$: Observable<apiCampaign[]| allCampaign[]>;
  genericCaptureData$!: Observable<any>;
  atmDataCaptureData$!: Observable<ATMData[]>;
  private captureValueBS = new BehaviorSubject<Campaign| apiCampaign>(this.apiCampaigns[0]);
  private createCampaignValueBS = new BehaviorSubject<apiCampaign[]| allCampaign[]>(this.apiCampaigns);
  private genericCaptureValueBS = new BehaviorSubject<any>(this.value);
  private atmDataCaptureValueBS = new BehaviorSubject<ATMData[]>(this.atms);

  constructor(private httpClient: HttpClient, private readonly router: Router, private readonly sanitizer: DomSanitizer) {
    this.captureData$ = this.captureValueBS.asObservable();
    this.createCampaignData$ = this.createCampaignValueBS.asObservable();
    this.genericCaptureData$ = this.genericCaptureValueBS.asObservable();
    this.atmDataCaptureData$ = this.atmDataCaptureValueBS.asObservable();
    // this._captureValueBS.next(this.captureData);
  }

  updatePreviewCaptureValue(dataAsParams: Campaign| apiCampaign) {
    this.captureValueBS.next(dataAsParams);
  }

  updateCreateCampaignValue(dataAsParams: apiCampaign[]| allCampaign[]) {
    this.createCampaignValueBS.next(dataAsParams);
    // this.router.navigate(['/view']);
  }

  genericCaptureValue(dataAsParams: any) {
    this.genericCaptureValueBS.next(dataAsParams);
  }

  atmDataCaptureValue(dataAsParams: ATMData[]) {
    this.atmDataCaptureValueBS.next(dataAsParams);
  }
 

}
