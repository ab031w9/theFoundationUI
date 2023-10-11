import { Component, OnInit, Sanitizer,ViewChild } from '@angular/core';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import { MarketingImage } from "src/app/models/api-models/marketing-image.model";
import { base64StringToBlob } from 'blob-util';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { ImageRenderService } from 'src/app/services/imageRender.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'src/app/models/ui-models/FileHandle';
import { SharedService } from 'src/app/services/shared.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { Language } from 'src/app/models/ui-models/language.model';
import { Approval } from 'src/app/models/ui-models/approval.model';
import { campaignLookup } from 'src/app/models/ui-models/campaignLookup.model';
import { newAPICampaign } from 'src/app/models/api-models/new-campaign.model';
import * as LZString from 'lz-string';


@Component({
  selector: 'app-marketing-screen',
  templateUrl: './marketing-screen.component.html',
  styleUrls: ['./marketing-screen.component.css']
})
export class MarketingScreenComponent implements OnInit {

  documentTypes: any[] = ["ID", "Bank Statements", "Proof of Residence", "Company Registration letter"];
  checkImages: boolean = false;
  campaignId: string | null | undefined;
  base64Image: any;
  selectedFile: any;
  canUpload: boolean = true;
  transactionalScreenArraySize : Number = 1; 
  idleScreenArraySize : Number = 6; 
  maximumUploadReached : boolean = false;
  savuButtonIsActive: boolean = true;

  @ViewChild('matSelect')
  matSelect!: MatSelect;

  screensModel: MarketingImage  = {
    id: 0,
    marketingImage: '',
    language: {
      id: 0,
      language: ''
    },
    imageName: '',
    duration: 0,
    priority: 0
  }

  apiCampaign: apiCampaign = {
    id: 6,
    campaignId: '',
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

  testFile : any =  
  {
    lastModified : 1668453753448,
    lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
    name : "Absa logo_Depth_RGB_PNG.png",
    size : 12044,
    type : "image/png",
    webkitRelativePath : ""
  };

  Tranlanguages: Language[] = 
  [{
    id: 0,
    language: '',
    languageCode: ''
  }];
  IdleLanguages: Language[] = 
  [{
    id: 0,
    language: '',
    languageCode: ''
  }];
  times: Number[] = [1,2,3,4,5];

  uiCampaign: Campaign = 
  {
    id: 1,
    campaignId: '',
          campaignName: '',
          campaignBy: '',
         screen: {
            id: 0,
            screenType: 'Transactional',
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
            language: this.screensModel.language, 
            duration: this.screensModel.duration,
            priority: this.screensModel.priority
          }]
  };
  ngOnInit(): void {
    

    let localLookupString = localStorage.getItem('campaign-lookup')? localStorage.getItem('campaign-lookup'): "";
    let localLookup: Language[] = localLookupString? JSON.parse(localLookupString? localLookupString: ""): "";

    if (!!localLookupString) 
    {
      this.Tranlanguages = localLookup;
      this.IdleLanguages = localLookup;
      console.log("Idle Lookup: ", this.IdleLanguages);
    }

    this.sharedService.captureData$.subscribe(targetData => {
      this.apiCampaign = targetData as apiCampaign;
    });

    this.removeImages(0, true);  //Testing

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

  }

  constructor(private readonly campaignService: CampaignService, private sharedService: SharedService,
      private readonly router: Router,private snackbar:MatSnackBar,private readonly sanitizer: DomSanitizer) {

    }
  removeImages(i: any, initial: boolean = false){
    let removedItem = this.uiCampaign.imageList.splice(i, 1);
    console.log("Removed item: ", removedItem[0].language.language);
    this.apiCampaign.imageList.splice(i, 1);
    if (!initial)  
      this.maximumUploadReached = this.apiCampaign.screen.screenType === "Transactional" && this.uiCampaign.imageList.length < 1 || 
      this.apiCampaign.screen.screenType === "Idle" && this.uiCampaign.imageList.length < 9 ? false : true;
      let localLookupString = localStorage.getItem('campaign-lookup')? localStorage.getItem('campaign-lookup'): "";
      let localLookup: Language[] = localLookupString? JSON.parse(localLookupString? localLookupString: ""): "";
     
      // if (this.apiCampaign.screen.screenType === "Idle") 
      // {
        if (this.uiCampaign.imageList.length > 0) { 
            // this.IdleLanguages = localLookup.filter(x => x.id as number < 9 && x.language != this.uiCampaign.imageList[0].language.language);
            this.Tranlanguages.push(localLookup.filter(x => x.id as number == i)[0]);
            this.IdleLanguages.push(localLookup.filter(x => x.language == removedItem[0].language.language)[0]);
            console.log("Re-Adding item: ", localLookup.filter(x => x.language == removedItem[0].language.language)[0]);
          }
          else {
            this.savuButtonIsActive = false;
            this.IdleLanguages = localLookup.filter(x => x.id as number < 9 );
            // this.Tranlanguages = localLookup.filter(x => x.id as number < 9);
          }
      // }
    
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
              id: new Number(this.screensModel.language.language[0]).valueOf(),
              language: new String(this.apiCampaign.screen.screenType === "Idle" ? this.IdleLanguages.filter(x => x.id == +this.screensModel.language.language[0])[0].language : this.Tranlanguages.filter(x => x.id == +this.screensModel.language.language[0])[0].language).toString() 
            }, 
            imageName: selectedFile.name,
            duration: this.screensModel.duration,
            priority: this.screensModel.priority
        }

      this.base64Image = await (await this.blobToBase64(fileHandle.file)).toString();

      //fileHandle.url = this.imageRenderService.base64toSafeUrlBlob(this.base64Image);

      
      

      this.uiCampaign.imageList.push(fileHandle);
      
      const apiImages : MarketingImage = {
        id: this.uiCampaign.imageList.length > 0 ?  this.uiCampaign.imageList.length - 1 : 0,
        marketingImage: this.base64Image,
        language: {
          id: new Number(this.screensModel.language.language[0]).valueOf(),
          language: new String(this.apiCampaign.screen.screenType === "Idle" ? this.IdleLanguages.filter(x => x.id == +this.screensModel.language.language[0])[0].language : this.Tranlanguages.filter(x => x.id == +this.screensModel.language.language[0])[0].language).toString()
        }, 
        imageName: this.uiCampaign.imageList[this.uiCampaign.imageList.length - 1].imageName,
        duration: this.screensModel.duration,
        priority: this.screensModel.priority
      };
  
      apiImages.duration = this.screensModel.duration;
      apiImages.language.id =  new Number(this.screensModel.language.language[0]).valueOf();
      apiImages.language.language =  new String( this.apiCampaign.screen.screenType === "Idle" ? this.IdleLanguages.filter(x => x.id == +this.screensModel.language.language[0])[0].language : this.Tranlanguages.filter(x => x.id == fileHandle?.language.id)[0].language).toString();

      this.apiCampaign.imageList.push(apiImages)
      this.canUpload = false;

      if (!this.apiCampaign.imageList[0].marketingImage) this.apiCampaign.imageList.splice(0, 1);
      
      if (this.apiCampaign.screen.screenType === "Idle") this.IdleLanguages.splice(+this.screensModel.language.language[1], 1);
      if (this.apiCampaign.screen.screenType === "Transactional") this.Tranlanguages.splice(+this.screensModel.language.language[1], 1);
      
      
      this.screensModel.duration = 0;
      this.screensModel.language.id = 0;
      this.screensModel.language.language = '';

    }

    console.log("Screen Type is: ", this.apiCampaign);
    console.log("Image List Length is: ", this.uiCampaign.imageList.length);
    
    this.maximumUploadReached = this.apiCampaign.screen.screenType === "Transactional" && (this.uiCampaign.imageList.length > 0 && this.uiCampaign.imageList.length < 9)  || 
    this.apiCampaign.screen.screenType === "Idle" && this.uiCampaign.imageList.length > 8 ? true : false; 
    this.savuButtonIsActive = this.apiCampaign.screen.screenType === "Idle" && this.uiCampaign.imageList.length > 0 ? true : false;
    

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

  onAdd(): void {
    try 
    {
      this.apiCampaign.campaignStartDate = new Date(this.apiCampaign.campaignStartDate);
      this.apiCampaign.campaignEndDate = new Date(this.apiCampaign.campaignEndDate);
      
      

      let localCampaignString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
      let localCampaign: apiCampaign[] = localCampaignString? JSON.parse(localCampaignString? LZString.decompress(localCampaignString): ""): "";

      if (!!this.apiCampaign) {
        localCampaign.push(
          {
            id: this.apiCampaign.id,
            campaignId: this.apiCampaign.campaignId,
                  campaignName: this.apiCampaign.campaignName,
                  campaignBy: this.apiCampaign.campaignBy,
                  screen: this.apiCampaign.screen,
                  marketingChannel: this.apiCampaign.marketingChannel,
                  campaignStartDate: new Date(this.apiCampaign.campaignStartDate),
                  campaignEndDate: new Date(this.apiCampaign.campaignEndDate),
                  imageList: this.apiCampaign.imageList,
                lastUpdate : this.apiCampaign.lastUpdate,
                updatedBy: this.apiCampaign.updatedBy,
                isActive: this.apiCampaign.isActive,
                isApproved: this.apiCampaign.isApproved,
                version: this.apiCampaign.version,
                isTargetted: this.apiCampaign.isTargetted,
                targetData: this.apiCampaign.targetData
        });
      }

      const newCampaignRequest: newAPICampaign = {
        campaignName: this.apiCampaign.campaignName,
        campaignBy: this.apiCampaign.campaignBy,
        campaignStartDate: new Date(Date.UTC(this.apiCampaign.campaignStartDate.getFullYear(),this.apiCampaign.campaignStartDate.getMonth(), this.apiCampaign.campaignStartDate.getDate())),
        campaignEndDate: new Date(Date.UTC(this.apiCampaign.campaignEndDate.getFullYear(),this.apiCampaign.campaignEndDate.getMonth(), this.apiCampaign.campaignEndDate.getDate())),
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
      
      this.saveATMMarketingCampaign(newCampaignRequest);

      localStorage.setItem("campaigns", JSON.stringify(localCampaign));
      localStorage.setItem("calendar-camp", JSON.stringify(this.apiCampaign));
    
      // this.sharedService.updateCreateCampaignValue(this.apiCampaign); -- What is this for ??


    }

    catch(exception) {
    ///  this.snackbar.open("Failed to create ATM Campaign - " + "Please Contact Admnistrator (FFA Team)." + "", undefined,
      //{
      //duration: 3000
      ///})
    }
     
  }

  previewCampaign(campaignId: string = '') {
    if (!!campaignId){
      this.router.navigate(['/preview/' + campaignId])
    }
    else {
      this.router.navigate(['/preview'])
    }

  }

  navigateToCalendar() {  //Re-load campaigns if changed ??
    // this.router.navigate(['/top-nav']);
    this.router.navigate(['/view']);
}

saveATMMarketingCampaign(newCampaignRequest: newAPICampaign){

   //Call service to create Campaign
   if (newCampaignRequest && !!newCampaignRequest.campaignName) {
    this.savuButtonIsActive = false;
      this.campaignService.createCampaign(newCampaignRequest)
      .subscribe({
        next:(successResponse) => {

          localStorage.removeItem('campaigns');
          
          // this.previewCampaign(successResponse.campaignId)

          this.getAllCampaigns();
            //Show notification
            this.snackbar.open("ATM Marketing Campaign " +  successResponse.campaignName +  " Created Successfully ",  undefined,
              {
              duration: 1000,
              panelClass: ['mat-toolbar', 'mat-primary']
              });
        },
        error: (errorResponse) => {
          
          
          if (errorResponse.status = 200) {
            this.snackbar.open("ATM Marketing Campaign " + errorResponse.error.text.split('campaign')[1] + " Created Successfully", undefined,
            {
            duration: 1000,
            panelClass: ['mat-toolbar', 'mat-primary']
            });
              this.getAllCampaigns();
          }
          else {
              this.snackbar.open("Failed to create ATM Campaign - " + errorResponse + "", undefined,
              {
              duration: 1000
              })
            }
          }
      });
   }
   else {
    this.snackbar.open("Failed to create ATM Campaign - Captured Data is Invalid", undefined,
    {
    duration: 1000
    })
   }
}

getAllCampaigns(): void {
  // -> Get All Campaigns

  this.campaignService.getCampaigns()
  .subscribe({
   next: (successResponse) => {
          localStorage.setItem('campaigns', LZString.compress(JSON.stringify(successResponse)));
          this.sharedService.updateCreateCampaignValue(successResponse);
          
          this.navigateToCalendar();
       },

    error: (errorRespo) => {
      
    }
 });
}

}