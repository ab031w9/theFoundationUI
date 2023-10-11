import { AfterViewInit, Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'src/app/models/ui-models/FileHandle';
import { FormGroup } from '@angular/forms';
import { base64StringToBlob } from 'blob-util';
import { ImageRenderService } from 'src/app/services/imageRender.service';
import { campaignLookup } from 'src/app/models/ui-models/campaignLookup.model';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CampaignHistory } from "../../models/api-models/campaign-history.model";
import { MarketingScreen } from "../../models/api-models/marketing-screen.model";
import { MarketingChannel } from "../../models/api-models/marketing-channel.model";
import { MarketingImage } from "../../models/api-models/marketing-image.model";
import { MarketingType } from "../../models/api-models/marketing-type.model";
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { SharedService } from 'src/app/services/shared.service';
import { MatStepper } from '@angular/material/stepper';
import {MatStepperModule} from '@angular/material/stepper';
import { newAPICampaign } from 'src/app/models/api-models/new-campaign.model';
import * as LZString from 'lz-string';


@Component({
  selector: 'app-marketing-view',
  templateUrl: './marketing-view.component.html',
  styleUrls: ['./marketing-view.component.scss']
})

export class MarketingViewComponent implements OnInit{

  currentDate: any = new Date();
  checkDates: boolean = false;
  checkImages: boolean = false;
   //myStepper?: MatStepper;
 @ViewChild('stepper') stepper!: MatStepper;

  testFile : any =  {
    lastModified : 1668453753448,
    lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
    name : "Absa logo_Depth_RGB_PNG.png",
    size : 12044,
    type : "image/png",
    webkitRelativePath : ""
  }

  private campaignDetailsForm!: FormGroup;



  // marketingType: any
  // marketingChannel: any
  // screenNumber: any

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
            imageName: '',
            language: {
              id: 0,
              language: ''
            },
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

  marketingChannel: any = [
    {
      "id": 1,
      "channel": "ATM",
      "imageResolution": "800x600"
    },
    {
      "id": 2,
      "channel": "SSK",
      "imageResolution": "1024x768"
    },
    {
      "id": 3,
      "channel": "BCD",
      "imageResolution": "800x600"
    }
  ];

  screenNumber: any = [
    {
      "screenId": 1,
      "screenNumber": "Screen 1"
    },
    {
      "screenId": 2,
      "screenNumber": "Screen 2"
    }
  ];

  apiCampaign: apiCampaign = {
    id: 0,
    campaignId: "",
    campaignName: "Valentine's Day",
    campaignBy: "Minenhle Mpulo (ZA)",
    screen: {
        "id": 0,
        "screenType": "Transactional",
        "screenNumber": "Screen 1",
        "channelId" : 0
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
     version: '1.0',
          targetData: {
            isTargetRegion: false,
            targetRegionOrAtm: ''
          },
    isTargetted: true
}

  campaignLookup: campaignLookup = {
    marketingScreens: [{
        id: 0,
        screenType: '',
        screenNumber: '',
        channelId: 0
      }],
      marketingChannels: [{
        id: 0,
        channel: '',
        imageResolution: ''
      }],
      languages: [{
        id: 0,
        language: '',
        languageCode: ''
    }]
    }

  isNewcampaign = false;
  header = '';
  base64Image: any;
  selectedDateRange!: DateRange<Date>;
  selectedFile: any;
  http: any;
  hasBaseDropZoneOver!:boolean;
  hasAnotherDropZoneOver!:boolean;
  response!:any;
    
  constructor(private readonly campaignService: CampaignService,
    private snackbar:MatSnackBar, private readonly route: ActivatedRoute,private readonly router: Router, private readonly sanitizer: DomSanitizer, private readonly imageRenderService: ImageRenderService,private previewDialog: MatDialog,
    private sharedService: SharedService) {

    }



  ngOnInit(): void {
          this.sharedService.genericCaptureValue(this.stepper);
          //console.log("This is stepper",this.stepper.next());
        //Save User Session Data
        let sessionUsername = localStorage.getItem("username")?.toString();
        this.uiCampaign.campaignBy = sessionUsername ? sessionUsername : "";

        // -> Get method to fetch all CampaignLookups from Service
      //   this.campaignService.getCampaignLookup()
      //   .subscribe({
      //    next: (successResponse) => {
                
      //           this.campaignLookup = successResponse;
      //             this.campaignLookup.marketingChannels[0] = {
      //                id: successResponse.marketingChannels[0].id,
      //                channel : successResponse.marketingChannels[0].channel,
      //                imageResolution: successResponse.marketingChannels[0].imageResolution
      //             }
      //             this.campaignLookup.marketingScreens[0] = {
      //                 id: successResponse.marketingScreens[0].id,
      //                 screenNumber : successResponse.marketingScreens[0].screenNumber,
      //                 screenType : successResponse.marketingScreens[0].screenType,
      //                 channelId : successResponse.marketingScreens[0].channelId
      //             }
                  

      //       }
      //  });

      //  this.getAllCampaigns();

    this.route.paramMap.subscribe(
      (params) => {

       this.campaignId =  params.get('id');
       if (this.campaignId){

        //Check If Route containes keyword 'Add'
        // -> new uiCampaign Functionality

        if (this.campaignId.toLocaleLowerCase() === 'Add'.toLocaleLowerCase())
        {
            this.isNewcampaign = true;
            // this.header = 'Capture ATM Marketing Screen Schedule';

        } else {

          this.isNewcampaign = false;
          this.header = ''
        }


        //Otherwise
        // -> Existing uiCampaign functionality
        //  this.campaignService.getCampaign(this.campaignId)
        //  .subscribe({
        //   next: (successResponse) => {
        //      //this.uiCampaign = successResponse;
        //       }
        // });


       }

      }
    );
  }


  ActivatePreviewDialog() {
     const dialogRef = this.previewDialog.open(PreviewDialogComponent, {
        width: '60%',
        data: this.uiCampaign,
     });
     dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  _onSelectedChange(date: Date): void {
    let box = document.getElementById('testing');

    if(this.currentDate < date)
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


      } else {
        this.selectedDateRange = new DateRange(date, null);
        this.uiCampaign.campaignStartDate = this.selectedDateRange.start?.toLocaleDateString() ? this.selectedDateRange.start?.toLocaleDateString(): "";
        this.uiCampaign.campaignEndDate = this.selectedDateRange.end?.toLocaleDateString() ? this.selectedDateRange.end?.toLocaleDateString(): "";

        
        
        this.checkDates = false;



      }
    }
  }

  onUpdate(): void {

    // Call uiCampaign service to update uiCampaign
    // this.campaignService.updateCampaign(this.uiCampaign.id, this.uiCampaign)
    // .subscribe({
    //   next:(successResponse) => {
    //     
    //       //Show a notification
    //       this.snackbar.open("uiCampaign " + successResponse.campaignName + "Updated Successfully", undefined,
    //        {
    //         duration: 2000
    //        });
    //   }
    // }
    // );
  }

  removeImages(i: any){
    this.uiCampaign.imageList.splice(i, 1);
    this.apiCampaign.imageList.splice(i, 1);
  }

testFunction(event: any){
  
  this.stepper.next();

}

  onDelete(): void {

    // Call uiCampaign service to delete uiCampaign
    this.campaignService.deleteCampaign(this.uiCampaign.campaignId)
    .subscribe({
      next:(successResponse) => {
        
          //Show a notification
          this.snackbar.open("uiCampaign " + successResponse.campaignName + "has been Removed from Database", undefined,
           {
            duration: 2000
           });
           setTimeout(()=>{
            this.router.navigateByUrl('campaigns');
           }, 2000);

      }
    }
    );
  }
  onAdd(): void {


    if(this.checkDates != false )
    {


      this.apiCampaign = {
      id: 0,
      campaignId: this.uiCampaign.campaignId,
            campaignName: this.uiCampaign.campaignName,
            campaignBy: this.uiCampaign.campaignBy,
            screen: this.uiCampaign.screen,
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

    const newCampaignRequest: newAPICampaign = {
      campaignName: this.apiCampaign.campaignName,
      campaignBy: this.apiCampaign.campaignBy,
      campaignStartDate: this.apiCampaign.campaignStartDate,
      campaignEndDate: this.apiCampaign.campaignEndDate,
      marketingChannelId: this.apiCampaign.marketingChannel.id as number,
      id: this.apiCampaign.id,
      campaignId: this.apiCampaign.campaignId,
      screenId: this.apiCampaign.screen.id as number,
      imageList: this.apiCampaign.imageList,
      lastUpdate: this.apiCampaign.lastUpdate,
      updatedBy: this.apiCampaign.updatedBy,
      isActive: this.apiCampaign.isActive,
      isApproved: this.apiCampaign.isApproved,
      version: this.apiCampaign.version,
      isTargetted: this.apiCampaign.isTargetted,
      targetData: this.apiCampaign.targetData
    }

    

    localStorage.setItem("calendar-camp", JSON.stringify(this.apiCampaign));

   //Call service to create Campaign
     this.campaignService.createCampaign(newCampaignRequest)
     .subscribe({
       next:(successResponse) => {

         
         this.previewCampaign(successResponse.campaignId)

           //Show a notification
           this.snackbar.open("ATM Marketing Campaign " + successResponse.campaignName  +   " Created Successfully", undefined,
            {
             duration: 1000
            });
       }
     });
    }
  }

  getAllCampaigns(): void {
       // -> Get All Campaigns
       this.campaignService.getCampaigns()
       .subscribe({
        next: (successResponse) => {
               
               
               localStorage.setItem('campaigns', LZString.compress(JSON.stringify(successResponse)));
            }
      });
  }

  async onFileSelected(event: any) {
    this.checkImages = true;
    

    if (event.target.files)
    {
        const selectedFile = event.target.files[0];
        const baseUrl = this.sanitizer.bypassSecurityTrustUrl (
          window.URL.createObjectURL(selectedFile)
      );
        const fileHandle: FileHandle | null | undefined = {
            file: selectedFile,
            url: baseUrl,
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 0,
            priority: 0
        }

      


      this.base64Image = await (await this.blobToBase64(fileHandle.file)).toString();

      //fileHandle.url = this.imageRenderService.base64toSafeUrlBlob(this.base64Image);

      this.uiCampaign.imageList.push(fileHandle);
      let apiImages : MarketingImage = {
        id: this.uiCampaign.imageList.length > 0 ?  this.uiCampaign.imageList.length - 1 : 0,
        marketingImage: this.base64Image,
        language:  {
          id: 1,
          language: 'En'
        },
        imageName: '',
        duration: 3.5,
        priority: 1
      };
      this.apiCampaign.imageList.push(apiImages)

      
      

  }
  }

 async blobToBase64(blob: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onerror = (e) => reject(fileReader.error);
      fileReader.onloadend = (e) => {
        const dataUrl = fileReader.result as string;
        // remove "data:mime/type;base64," prefix from data url
        //const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
        resolve(dataUrl);
      };
      fileReader.readAsDataURL(blob);
    });
  }

  base64toSafeUrlBlob(base64ImageData: any) {
    const contentType = 'image/png';
    const blob = base64StringToBlob(base64ImageData, contentType);

    const url = this.sanitizer.bypassSecurityTrustUrl (
      window.URL.createObjectURL(blob)
  );

      return url;
  }

  // previewCampaign() {
  //   this.router.navigate(['/preview'])
  // }

  previewCampaign(campaignId: string = '') {
    if (!!campaignId){
      this.router.navigate(['/preview/' + campaignId])
    }
    else {
      this.router.navigate(['/preview'])
    }

  }



}



