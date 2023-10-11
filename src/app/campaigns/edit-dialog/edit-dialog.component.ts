import { Component, OnInit, Inject, ChangeDetectorRef, ChangeDetectionStrategy, EmbeddedViewRef } from '@angular/core';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { base64StringToBlob } from 'blob-util';
import { ImageRenderService } from 'src/app/services/imageRender.service';
import { CampaignService } from '../../services/campaign.service';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'src/app/models/ui-models/FileHandle';
import { DateRange } from '@angular/material/datepicker';
import { Approval } from 'src/app/models/ui-models/approval.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApprovalService } from 'src/app/services/approval.service';
import { apiApproval } from 'src/app/models/api-models/approval.model';
import * as LZString from 'lz-string';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDialogComponent implements OnInit {

  campaignName: any = '';
  editMode: boolean = true;

  testFile : any =  {
    lastModified : 1668453753448,
    lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
    name : "Absa logo_Depth_RGB_PNG.png",
    size : 12044,
    type : "image/png",
    webkitRelativePath : ""
  }


  isTargets: string[] = ['Yes', 'No'];
  targets: string[] = ['Region', 'ATM'];
  targetType: string = '';
  isTargetedCampaign!: boolean;

  selectedDateRange!: DateRange<Date>;

  apiCampaign: apiCampaign[] = [
    {
    id: 0,
    campaignId: "",
    campaignName: "Valentine's Day",
    campaignBy: "Minenhle Mpulo (ZA)",
    screen: {
        "id": 0,
        "screenType": "Transactional",
        "screenNumber": "Screen 1",
        "channelId": 0
    },
    marketingChannel: {
        "id": 0,
        "channel": "ATM",
        "imageResolution": ""
    },
    campaignStartDate: new Date("2023-03-15T22:00:00.000Z"),
    campaignEndDate: new Date("2023-03-21T22:00:00.000Z"),
    imageList: [
        {
            "id": 0,
            "marketingImage": "",
            "language": {
                "id": 0,
                "language": "Zul"
            },
            "imageName": "MarketingA_en_2.jpg",
            "duration": 2,
            "priority": 0
        }
    ],
    lastUpdate: {
        id: 0,
        campaignId: 0,
        updatedDate: new Date("2023-01-11"),
        updatedBy: "Minenhle Mpulo (ZA)",
        updateDescription: "",
        approvalId: 0
    },
    updatedBy: "Minenhle Mpulo (ZA)",
    isActive: false,
    isApproved: false,
    version: "1.0",
    isTargetted: true,
  "targetData": {
    isTargetRegion: false, 
    targetRegionOrAtm: ''
  }
},
{
  "id": 0,
  "campaignId": "",
  "campaignName": "Campaign Target by ATM",
  "campaignBy": "Minenhle Mpulo (ZA)",
  "screen": {
           "id": 0,
      "screenType": "Idle",
      "screenNumber": "Screen 1",
      "channelId": 0
  },
  "marketingChannel": {
      "id": 0,
      "channel": "ATM",
      "imageResolution": ""
  },
  "campaignStartDate": new Date("2023-03-22"),
  "campaignEndDate": new Date("2023-03-29"),
  "imageList": [
      {
          "id": 0,
          "marketingImage": "",
          "language": {
              "id": 0,
              "language": "Eng"
          },
          "imageName": "MarketingA_en_1.jpg",
          "duration": 1,
          "priority": 0
      },
      {
          "id": 1,
          "marketingImage": "",
          "language": {
              "id": 0,
              "language": "Afr"
          },
          "imageName": "MarketingA_en_2.jpg",
          "duration": 2,
          "priority": 0
      },
      {
          "id": 2,
          "marketingImage": "",
          "language": {
              "id": 0,
              "language": "Nde"
          },
          "imageName": "MarketingA_en_3.jpg",
          "duration": 3,
          "priority": 0
      },
      {
          "id": 3,
          "marketingImage": "",
          "language": {
              "id": 0,
              "language": "Tso"
          },
          "imageName": "MarketingA_en_4.jpg",
          "duration": 5,
          "priority": 0
      },
      {
          "id": 4,
          "marketingImage": "",
          "language": {
              "id": 0,
              "language": "Ven"
          },
          "imageName": "MarketingA_en_5.jpg",
          "duration": 3,
          "priority": 0
      },
      {
          "id": 5,
          "marketingImage": "",
          "language": {
              "id": 0,
              "language": "Swa"
          },
          "imageName": "MarketingA_en_6.jpg",
          "duration": 4,
          "priority": 0
      }
  ],
  "lastUpdate": {
      "id": 0,
      "campaignId": 0,
      "updatedDate": new Date("2023-01-11"),
      "updatedBy": "Minenhle Mpulo (ZA)",
      "updateDescription": "",
      "approvalId": 0
  },
  "updatedBy": "Minenhle Mpulo (ZA)",
  "isActive": false,
  "isApproved": false,
  "version": "1.0",
  "isTargetted": true,
  "targetData": {
    isTargetRegion: false, 
    targetRegionOrAtm: ''
  }
}];

uiCampaign: Campaign = {
  id: 1,
  campaignId: '',
        campaignName: '',
        campaignBy: '',
        screen: {
          id: 0,
          screenType: '',
          screenNumber: '',
          channelId: 0
        },
        channel: {
          id: 0,
          channel: '',
          imageResolution: ''
        },
        campaignStartDate: '',
        campaignEndDate: '',
        imageList: [{
          file: this.testFile,
          url: {
            changingThisBreaksApplicationSecurity : "blob:http://localhost:4200/ad5b6325-e05b-4967-8631-84d190ce0f64"
          },
          imageName: '',
          language: {
            id: 0,
            language: ''
          },
          duration: 0,
          priority: 0
        }]
};

  isApproved: boolean = false;

  constructor(private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Campaign, private sharedService: SharedService,
    private readonly approvalService: ApprovalService,private readonly campaignService: CampaignService, private readonly sanitizer: DomSanitizer, private readonly imageRenderService: ImageRenderService,
    private previewDialog: MatDialog,private snackbar:MatSnackBar, private readonly router: Router, private changeDetectorRef: ChangeDetectorRef) {
        
        this.sharedService.updatePreviewCaptureValue(this.data);
        this.getImageList(this.data.id);
    }


  ngOnInit(): void {
    this.transfromAPICampaignToUI();
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(){
    console.log("After View Init");
  }


  getImageList(campaignId: Number) {
    const successResponse = this.campaignService.getCampaignImageList(campaignId);
    console.log("ImageList: ", successResponse);
    let campainsString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
    let campaigns: apiCampaign[] = campainsString? JSON.parse(campainsString? LZString.decompress(campainsString): ""): "";
    let campaign = campaigns.filter(camp => camp.id == campaignId);
    const campIndex = campaigns.indexOf(campaign[0]);
    successResponse.subscribe({
      next: (imageList) => {
        console.log("Inside Response: ", imageList);
        
        campaigns[campIndex].imageList = imageList;
        localStorage.setItem('campaigns', LZString.compress(JSON.stringify(campaigns)));
        console.log("Campaigns Assigned: ", campaigns);
        imageList.forEach(element => {
          this.uiCampaign.imageList.push(
            {
              file: this.testFile,
              url: element.marketingImage,
              imageName: '',
              language: {
                id: element.language.id,
                language: element.language.language
              },
              duration: element.duration,
              priority: element.priority
            }
          );
        });
      }
    });
  
    
    console.log("Local Storage: ", campaigns);
  }
  

  navigateToCapture(){

  }

  base64toSafeUrlBlob(base64ImageData: any) {
    const contentType = 'image/png';
    const blob = base64StringToBlob(base64ImageData, contentType);
    const url = this.sanitizer.bypassSecurityTrustUrl (
      window.URL.createObjectURL(blob)
  );

      return url;
  }

  navigateToMarketingScreens(){
  }


  transfromAPICampaignToUI() {

    let campainsString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
    let campaigns: apiCampaign[] = campainsString? JSON.parse(campainsString? 
                                                LZString.decompress(campainsString): ""): "";
    campaigns = campaigns.filter(camp => camp.campaignId == this.data.campaignId);
    if (campaigns.length > 0) 
      {
          
          this.uiCampaign = {
            id: 1,
            campaignId: campaigns[0].campaignId,
            campaignName: campaigns[0].campaignName,
            campaignBy: campaigns[0].campaignBy,
            screen: campaigns[0].screen,
            channel: campaigns[0].marketingChannel,
            campaignStartDate: campaigns[0].campaignStartDate.toString(),
            campaignEndDate: campaigns[0].campaignEndDate.toString(),
            imageList: [{
              file: this.testFile,
              url: {
                changingThisBreaksApplicationSecurity : "blob:http://localhost:4200/ad5b6325-e05b-4967-8631-84d190ce0f64"
              },
              imageName: '',
              language: {
                id: 0,
                language: ''
              },
              duration: 0,
              priority: 0
            }]
          }
          
          let start = new Date(campaigns[0].campaignStartDate);
          let end = new Date(campaigns[0].campaignEndDate); 

        this.selectedDateRange = new DateRange(
          new Date(formatDate(start.setDate(start.getDate()),'yyyy-MM-dd', 'en_US')),
          new Date(formatDate(end.setDate(end.getDate()),'yyyy-MM-dd', 'en_US'))
        );
          
        console.log("UI CAMP BEFORE: ", this.uiCampaign);
        

        this.uiCampaign.imageList.pop();

        //Changed this.apiCamp to campaigns[0] for this foreach
        campaigns[0].imageList.forEach(element => {
          this.uiCampaign.imageList.push(
            {
              file: this.testFile,
              url: element.marketingImage,
              imageName: element.imageName,
              language: {
                id: element.language.id,
                language:element.language.language
              },
              duration: element.duration,
              priority: element.priority
            }
          );
        });
        this.isApproved = campaigns[0].isApproved;
        
        console.log("UI CAMP AFTER: ", this.uiCampaign);
        if (this.uiCampaign.imageList.length > 0) {
        this.uiCampaign.imageList.forEach((element,index) => {

        if (index < campaigns[index].imageList.length) {
        this.uiCampaign.imageList[index].url = campaigns[index].imageList[index].marketingImage;
        this.uiCampaign.imageList[index].language =  campaigns[index].imageList[index].language;
        this.uiCampaign.imageList[index].duration =  campaigns[index].imageList[index].duration;
        this.uiCampaign.imageList[index].priority =  campaigns[index].imageList[index].priority;
        }
        

        // this.uiCampaign.imageList[index].url = this.imageRenderService.base64toSafeUrlBlob(this.apiCampaign[index].imageList[index].marketingImage);

        });
      }
    }

    console.log("Local Storage: ", campaigns);
    console.log("UI Campaigns: ", this.uiCampaign);
    
    //To-Do
    // this.selectedDateRange = new DateRange<Date>(campaigns[0].campaignStartDate, campaigns[0].campaignEndDate);

  }

  approveCampaign(){
    let campainApprovalString = localStorage.getItem('campaign-approvals')? localStorage.getItem('campaign-approvals'): "";
    let campaignApprovals: Approval[] = campainApprovalString? JSON.parse(campainApprovalString? campainApprovalString: ""): "";

    let localCampaignString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
    let localCampaign: apiCampaign[] = localCampaignString? JSON.parse(localCampaignString? LZString.decompress(localCampaignString): ""): "";

    let username = localStorage.getItem('token') ? localStorage.getItem('token') : "No Username in Ui";

    if (!!this.apiCampaign && !!username) {
    // let campaignApproval = campaignApprovals.filter(camp => camp.campaignId == element.campaignId)[0];
      const campaignApprovalRequest: apiApproval = {
        campaignId: this.data.id,
        approvalTime: new Date(),
        approvedBy: username
      };

      //Call service to Approve Campaign
      this.approvalService.createCampaignApprovals(campaignApprovalRequest)
      .subscribe({
        next:(successResponse) => {

          localStorage.removeItem('campaigns');
          
          // this.previewCampaign(successResponse.campaignId)
          this.getAllCampaigns();
                     //Show toaster notification
          this.snackbar.open("ATM Marketing Campaign " + this.data.campaignName   + "Has Been Approved and can be consumed by Devices", undefined,
          {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
          });
        },
        error: (errorResponse) => {
          
          
          if (errorResponse.status = 204) {
            localStorage.removeItem('campaigns');
            this.getAllCampaigns();
                     //Show toaster notification
          this.snackbar.open("ATM Marketing Campaign " + this.data.campaignName   + "Has Been Approved and can be consumed by Devices", undefined,
          {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
          });
          }
          else {
              this.snackbar.open("Failed to Approve ATM Campaign - " + errorResponse + "", undefined,
              {
              duration: 3000
              })
            }
          }
      });
      }
    
  }

  navigateToApprovals(){

    this.router.navigate(['/view']);
  }

   formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dayOfWeek = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    const monthIndex = date.getUTCMonth();
    const monthName = monthNames[monthIndex];

    return `${dayOfWeek} ${dayOfMonth} ${monthName} ${year} ${hours}:${minutes}:${seconds}`;
  }

  getAllCampaigns(): void {
    // -> Get All Campaigns
  
    this.campaignService.getCampaigns()
    .subscribe({
     next: (successResponse) => {
            localStorage.setItem('campaigns', LZString.compress(JSON.stringify(successResponse)));
            this.sharedService.updateCreateCampaignValue(successResponse);
            
            this.navigateToApprovals();
         },
  
      error: (errorRespo) => {
        
      }
   });
  }

}
