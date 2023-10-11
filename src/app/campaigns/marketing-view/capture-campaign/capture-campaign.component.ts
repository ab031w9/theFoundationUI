 import { Component, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
//import { AfterViewInit, Component, OnInit, Sanitizer } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from 'src/app/services/campaign.service';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { ImageRenderService } from 'src/app/services/imageRender.service';
import { campaignLookup } from 'src/app/models/ui-models/campaignLookup.model';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { __values } from 'tslib';
import { MatStepper } from '@angular/material/stepper';
//import { MatHorizontalStepper } from '@angular/material';
import * as LZString from 'lz-string';

@Component({
  selector: 'app-capture-campaign',
  templateUrl: './capture-campaign.component.html',
  styleUrls: ['./capture-campaign.component.css']
})
export class CaptureCampaignComponent implements OnInit {

  entityTypes: any[] = ["Sole Peoprietor", "Close Corporation", "Private Company", "Private Company"];
  uniqueCurrentDate = new Date();
  checkDates: boolean = false;
  checkImages: boolean = false;
  selectedDateRange!: DateRange<Date>;
  testDates: boolean = true;
  uniqueScreenTypes: string[] = [""];
  maxDate: any = new Date();
  //stepper: MatStepper;
  @Output() myTest = new EventEmitter<MatStepper>();
  @ViewChild('stepper') myStepper!: MatStepper;
 // @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;


  testFile : any =  {
    lastModified : 1668453753448,
    lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
    name : "Absa logo_Depth_RGB_PNG.png",
    size : 12044,
    type : "image/png",
    webkitRelativePath : ""
  }


    campaignsTest: Campaign[] = [{
    id: 1,
          campaignId: 'CN0000001',
          campaignName: 'Purchase Insurance by scanning the QR Code',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: "Transactional",
            screenNumber: "",
            channelId: 0
          },
          channel: {
            id: 0,
            channel: "ATM",
            imageResolution: ""
          },
          campaignStartDate: '2023-04-01T08:00:43.511Z',
          campaignEndDate: '2023-04-08T08:00:43.511Z',
          imageList: [{
            file: this.testFile,
            url: {
              changingThisBreaksApplicationSecurity : "blob:http://localhost:4200/ad5b6325-e05b-4967-8631-84d190ce0f64"
            },
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 0,
            priority: 0
          }]
  },{
    id: 7,
    campaignId: 'CN0000007',
          campaignName: 'S&I Digital Bonus Rate',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: "Idle",
            screenNumber: "Screen 4",
            channelId: 0
          },
          channel: {
            id: 0,
            channel: "ATM",
            imageResolution: ""
          },
          campaignStartDate: '2023-03-12T08:00:43.511Z',
          campaignEndDate: '2023-03-19T08:00:43.511Z',
          imageList: [{
            file: this.testFile,
            url: {
              changingThisBreaksApplicationSecurity : "blob:http://localhost:4200/ad5b6325-e05b-4967-8631-84d190ce0f64"
            },
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 0,
            priority: 0
          }]
  },{
    id: 3,
    campaignId: 'CN0000003',
          campaignName: 'New Year 2023',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: "Idle",
            screenNumber: "Screen 4",
            channelId: 0
          },
          channel: {
            id: 0,
            channel: "ATM",
            imageResolution: ""
          },
          campaignStartDate: '2023-03-21T08:00:43.511Z',
          campaignEndDate: '2023-03-27T08:00:43.511Z',
          imageList: [{
            file: this.testFile,
            url: {
              changingThisBreaksApplicationSecurity : "blob:http://localhost:4200/ad5b6325-e05b-4967-8631-84d190ce0f64"
            },
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 10,
            priority: 1
          }]
  },
  {
    id: 2,
    campaignId: 'CN0000002',
          campaignName: 'Absa ChatWallet',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: "Idle",
            screenNumber: "Screen 4",
            channelId: 0
          },
          channel: {
            id: 0,
            channel: "ATM",
            imageResolution: ""
          },
          campaignStartDate: '2023-03-28T08:00:43.511Z',
          campaignEndDate: '2023-04-03T08:00:43.511Z',
          imageList: [{
            file: this.testFile,
            url: {
              changingThisBreaksApplicationSecurity : "blob:http://localhost:4200/ad5b6325-e05b-4967-8631-84d190ce0f64"
            },
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 0,
            priority: 0
          }]
  }];




  campaignId: string | null | undefined;
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
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 0,
            priority: 0
          }]
  };

  marketingType: any = [{
    "marketingTypeId": 1,
    "marketingType": "Idle"
  },
  {
    "marketingTypeId": 2,
    "marketingType": "Transactional"
  }];

  receiverDeviceType: any = [
    {
      "deviceTypeId": 1,
      "channel": "ATM",
      "resolution": "800x600"
    },
    {
      "deviceTypeId": 2,
      "channel": "SSK",
      "resolution": "1024x768"
    },
    {
      "deviceTypeId": 3,
      "channel": "BCD",
      "resolution": "800x600"
    }
  ];

 //screenNumber: any = [
  //  {
     // "screenId": 1,
     /// "screenNumber": "Screen 1"
   // },
   // {
     // "screenId": 2,
     // "screenNumber": "Screen 2"
  //  },
    //{
      //"screenId": 3,
      //"screenNumber": "Screen 3"
   // },
    //{
     // "screenId": 4,
      //"screenNumber": "Screen 4"
   // }
   // ,
  //  {
      //"screenId": 5,
     // "screenNumber": "Screen 5"
  //  },
    //{
      //"screenId": 6,
    //  "screenNumber": "Screen 6"
   // } 
  //];

  apiCampaign: apiCampaign = {
    id: 6,
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
  }


  campaignLookup: campaignLookup = {

    marketingScreens: [],
    marketingChannels: [],
    languages: []

  }

constructor(private readonly campaignService: CampaignService, private sharedService: SharedService){}


  ngOnInit(): void 
    
    {

    this.maxDate = new Date(this.maxDate.setMonth(this.maxDate.getMonth() + 3));

      //this.checkCampaignDates();
      this.sharedService.captureData$.subscribe(targetData => 
        {
            this.apiCampaign = targetData as apiCampaign;
        });
      this.sharedService.genericCaptureData$.subscribe(data =>
        {
            this.myStepper = data;
        });
      //Save User Session Data
       let sessionUsername = localStorage.getItem("token")?.toString();
       this.uiCampaign.campaignBy = sessionUsername ? sessionUsername : "";

       // -> Get method to fetch all CampaignLookups from Service
       this.campaignService.getCampaignLookup()
       .subscribe(
          {
            next: (successResponse) => 
            {
              this.campaignLookup = successResponse;
              this.campaignLookup.marketingChannels[0] = {
                id: successResponse.marketingChannels[0].id,
                channel : successResponse.marketingChannels[0].channel,
                imageResolution: successResponse.marketingChannels[0].imageResolution
              }
              this.campaignLookup.marketingScreens[0] = {
                  id: successResponse.marketingScreens[0].id,
                  screenNumber : successResponse.marketingScreens[0].screenNumber,
                  screenType :  successResponse.marketingScreens[0].screenType,
                  channelId : successResponse.marketingScreens[0].channelId
              }
              this.campaignLookup.languages[0] = {
                id: successResponse.languages[0].id,
                language : successResponse.languages[0].language,
                languageCode :  successResponse.languages[0].languageCode
            }

              localStorage.setItem("campaign-lookup", JSON.stringify(this.campaignLookup.languages));

              this.uniqueScreenTypes = [...new Set(successResponse.marketingScreens.map(item => item.screenType))].filter(x => x == "Idle");
              
        }
      });



  }

  navigateToMarketingScreens(event: any) {

    this.testDates = this.checkCampaignDates(new Date(this.uiCampaign.campaignStartDate), new Date(this.uiCampaign.campaignEndDate), this.uiCampaign.channel.channel, this.uiCampaign.screen.screenNumber)
    if(this.testDates == true)
    {
      //this.myStepper.next();
    // this.apiCampaign.channel.channel = this.targetType;
    

    this.apiCampaign = {
      id: 0,
      campaignId: this.uiCampaign.campaignId,
            campaignName: this.uiCampaign.campaignName,
            campaignBy: this.uiCampaign.campaignBy,
            screen:  {
              id: (this.campaignLookup.marketingScreens.filter(x => x.screenType == this.uiCampaign.screen.screenType))[0].id,
              screenNumber : this.uiCampaign.screen.screenNumber,
              screenType : this.uiCampaign.screen.screenType,
              channelId : this.uiCampaign.channel.id
            },
            marketingChannel: this.uiCampaign.channel,
            campaignStartDate: new Date(this.uiCampaign.campaignStartDate),
            campaignEndDate: new Date(this.uiCampaign.campaignEndDate),
            imageList: this.apiCampaign.imageList,
          lastUpdate : this.apiCampaign.lastUpdate,
          updatedBy: this.apiCampaign.updatedBy,
          isActive: this.apiCampaign.isActive,
          isApproved: this.apiCampaign.isApproved,
          version: this.apiCampaign.version,
          isTargetted: this.apiCampaign.isTargetted,
          targetData: this.apiCampaign.targetData
    }


      this.sharedService.updatePreviewCaptureValue(this.apiCampaign);
      this.myTest.emit(this.myStepper);
    }
    else
    {

      
      
      //event.stopPropagation();
    }
  }

//check

checkCampaignDates(firstDate: Date | null, secondDate: Date | null, channels: string, screens: string): boolean {

  let dateValue = true;
if(secondDate == null || firstDate == null )
{
  dateValue = true;

}
else{

  let campainsString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
    let campaigns: apiCampaign[] = campainsString? JSON.parse(campainsString? LZString.decompress(campainsString): ""): "";

  for(let test of campaigns){
       let dateTest = new Date(test.campaignStartDate);
       let dateTest1 = new Date(test.campaignEndDate);
       let testChannel = test.marketingChannel.channel;
       let testScreen = test.screen.screenNumber;    
  
      
      if( (dateTest <= secondDate)  && (dateTest1 >= firstDate) && (channels == testChannel) && (screens == testScreen) )
      {
        dateValue = false;
        break;
      }

      if (firstDate < secondDate && secondDate < firstDate)
      {
       dateValue = false;
       break;
      }
  }
}
  return dateValue;
}


  _onSelectedChange(date: Date): void {
    let box = document.getElementById('testing');

    if(this.uniqueCurrentDate < date)
    {

      if (
        this.selectedDateRange &&
        this.selectedDateRange.start &&
        date > this.selectedDateRange.start &&
        !this.selectedDateRange.end
      ) {
        this.selectedDateRange = new DateRange(
          this.selectedDateRange.start,
          date
        );
        this.uiCampaign.campaignStartDate = this.selectedDateRange.start?.toLocaleDateString() ? this.selectedDateRange.start?.toLocaleDateString(): "";
        this.uiCampaign.campaignEndDate = this.selectedDateRange.end?.toLocaleDateString() ? this.selectedDateRange.end?.toLocaleDateString(): "";

        
        
        this.checkDates = true;
        this.testDates = true;


      } else {
        this.selectedDateRange = new DateRange(date, null);
        this.uiCampaign.campaignStartDate = this.selectedDateRange.start?.toLocaleDateString() ? this.selectedDateRange.start?.toLocaleDateString(): "";
        this.uiCampaign.campaignEndDate = this.selectedDateRange.end?.toLocaleDateString() ? this.selectedDateRange.end?.toLocaleDateString(): "";

        
        
        this.checkDates = false;
        this.testDates = true;



      }
    }
  }



}
