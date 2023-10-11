import { Component, EventEmitter, OnInit, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from '../../services/login.service';
import { CampaignService } from '../../services/campaign.service';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { allCampaign } from 'src/app/models/api-models/campaign-all.model';
import * as LZString from 'lz-string';


const THUMBUP_ICON =
  `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="70px" height="70px" viewBox="0 0 70 70" enable-background="new 0 0 70 70" xml:space="preserve">  <image id="image0" width="70" height="70" x="0" y="0"
    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACxFBMVEUAAABjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNjCTNj
CTNjCTNjCTP///9xtqhDAAAA6nRSTlMAAAMKEBQRCwQ4Y4yrwM7Swq2OZjsWARNMlM/x8plQHnPK
+Pl6IxVy1uTLtKObmqKz4vfbGQJJw/7vvn8lBgUPRnu67FGC3IoJNITX8yHjgXnetigs+qkxKqDM
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" />
</svg>


`;

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private auth: LoginService, private ref: ChangeDetectorRef, private sharedService: SharedService, private readonly campaignService: CampaignService) {
    iconRegistry.addSvgIconLiteral('absa-home', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));
  }

  isAuthenticated: boolean = false;
  username: any = "";
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
    updatedBy: "",
    isActive: false,
    isApproved: false,
    version: "1.0",
    isTargetted: true,
  "targetData": {
    isTargetRegion: false, 
    targetRegionOrAtm: ''
  }
}];

  ngOnInit(): void {

        this.auth.captureData$.subscribe((data)=> {
            if (data) {
              this.username = data.displayName;
              this.isAuthenticated = data.isAuthenticated as boolean;
              this.ref.detectChanges();
            }            
        });    
        
        if (localStorage.getItem("isAuthenticatedUser")?.toString() === "true" && !this.username) {
          this.username =  localStorage.getItem("token")?.toString();
          this.isAuthenticated = localStorage.getItem("isAuthenticatedUser")?.toString() == "true";
        }
        this.getAllCampaigns();
  }

  logout(){   
    localStorage.removeItem('user');
      this.isAuthenticated = false;
      this.auth.logout();    
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  getAllCampaigns(): void {
    // -> Get All Campaigns
    
    
    this.campaignService.getCampaigns()
    .subscribe({
     next: (successResponse) => {
            const camps = this.transformCampaigns(successResponse);
            localStorage.setItem('campaigns', LZString.compress(JSON.stringify(camps)));
            this.sharedService.updateCreateCampaignValue(camps);
            
         },
         
      error: (errorRespo) => {
        
      }
   });
}
transformCampaigns(campaigns: allCampaign[]): apiCampaign[]{ ///Temp Sol for Approvals 
  campaigns.forEach(element => {
      this.apiCampaign.push(
        {
          campaignName: element.campaignName,
          campaignBy: element.campaignBy,
          campaignStartDate: element.campaignStartDate,
          campaignEndDate: element.campaignEndDate,
          marketingChannel: element.marketingChannel,
          id: element.id,
          campaignId: element.campaignId,
          screen: element.screen,
          imageList: element.imageList,
          lastUpdate: element.lastUpdate,
          updatedBy: element.updatedBy,
          isActive: element.isActive,
          isApproved: element.isApproved,
          version: element.version,
          isTargetted: element.isTargetted,
          targetData: {
            targetRegionOrAtm: '',
            isTargetRegion: false
          }
        }
      )
  });
  this.apiCampaign.splice(0,1);
  return this.apiCampaign;
}
}

