import { Component, HostListener, OnInit, VERSION, ViewChild, Inject, Optional, Injector, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { ImageRenderService } from 'src/app/services/imageRender.service';
import { Campaign } from '../../models/ui-models/campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { SharedService } from 'src/app/services/shared.service';
import { isDateSpansEqual } from '@fullcalendar/core/internal';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { CampaignHistory } from "../../models/api-models/campaign-history.model";
import { MarketingScreen } from "../../models/api-models/marketing-screen.model";
import { MarketingChannel } from "../../models/api-models/marketing-channel.model";
import { MarketingImage } from "../../models/api-models/marketing-image.model";
import { MarketingType } from "../../models/api-models/marketing-type.model";
import { DateRange } from '@angular/material/datepicker';
import * as LZString from 'lz-string';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-preview-screen',
  templateUrl: './preview-screen.component.html',
  styleUrls: ['./preview-screen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewScreenComponent implements OnInit {

  testFile : any =  new File(["foo"], "foo.png", {
    type: "image/png",
  });
  testFile2 : any =  new File(["foo2"], "foo2.png", {
    type: "image/png",
  });
  selectedDateRange!: DateRange<Date>;
  header: any = 'Preview Campaign : \t' + 'S&I Digital Bonus Rate';
  campaign: Campaign = {
    id: 1,
    campaignId: '',
          campaignName: 'S&I Digital Bonus Rate',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: '',
            screenNumber: '',
            channelId: 0
          },
          channel: {
            id: 0,
            channel: 'ATM',
            imageResolution: ''
          },
          campaignStartDate: '',
          campaignEndDate: '',
          imageList: [{
            file: this.testFile,
            url: '',
            language: {
              id: 0,
              language: ''
            },
            imageName: '',
            duration: 0,
            priority: 0
          }]
  };
  slides = [
    {
      src: '/assets/MarketingA_en_2.jpg',
      alt: 'First slide',
      width: 800,
      height: 600
    },
    {
      src: '/assets/MarketingA_en_5.jpg',
      alt: 'Second slide',
      width: 800,
      height: 600
    },
    {
      src: '/assets/MarketingA_en_4.jpg',
      alt: 'Third slide',
      width: 800,
      height: 600
    }
  ];

  uiCampaign: Campaign = {
    id: 1,
    campaignId: 'CN000000002',
          campaignName: 'S&I Digital Bonus Rate',
          campaignBy: 'M. Mpulo',
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
          campaignStartDate: '2023-01-12',
          campaignEndDate: '2023-01-19',
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

  apiCampaigns: apiCampaign = {
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
            updatedBy: '',
            updateDescription: '',
            approvalId: 0
        },
          updatedBy: '',
          isActive: false,
          isApproved: false,
          isTargetted: false,
            version: '1.0',
          targetData: {
            isTargetRegion: false,
            targetRegionOrAtm: ''
          }

  };

  currentSlide = 0;
  interval: any;
  autoplay = true;
  autoplayInterval = 1000; // 5 seconds
  showProgress = false;
  campaignId!: string | null;
  apiCampaign!: apiCampaign | null;
  campaigns!: apiCampaign[] | null;
  private dialogRef : any | null;
  private data: Campaign;
  editMode: boolean = false;
  constructor(private readonly campaignService: CampaignService,
    private snackbar:MatSnackBar, private readonly route: ActivatedRoute, private readonly router: Router, private readonly imageRenderService: ImageRenderService,
    private sharedService: SharedService, private injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
        this.dialogRef = this.injector.get(MatDialogRef<PreviewDialogComponent>, null);
        this.data = this.injector.get(MAT_DIALOG_DATA, null);
        
        this.data = !!this.data ? this.uiCampaign : this.data;
  }

  
  ngOnInit(): void {

    if (!!this.data && !this.campaignId) {

      const campData : Campaign = this.data? this.data : this.uiCampaign;
      this.uiCampaign = {
        id: 1,
         campaignId: campData.campaignId,
         campaignName: campData.campaignName,
         campaignBy: campData.campaignBy,
         screen: campData.screen,
         channel: campData.channel,
         campaignStartDate: campData.campaignStartDate,
         campaignEndDate: campData.campaignEndDate,
         imageList: campData.imageList
     };
    }
    this.route.paramMap.subscribe(
      async (params) => {

       this.header = '';
       this.campaignId =  params.get('id');
       if (this.campaignId){

        //Otherwise
        // -> Existing uiCampaign functionality

        //Use campaigns in local storage, else fetch from service

        let campainsString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
        let campaigns: apiCampaign[] = campainsString? JSON.parse(campainsString? LZString.decompress(campainsString): ""): "";
        let campaign = campaigns.filter(camp => camp.campaignId == this.campaignId);
        const campIndex = campaigns.indexOf(campaign[0]);

        if (!!campainsString) {
          console.log("Inside IF: ", campaigns[campIndex]);
          if (campaigns[campIndex].imageList.length < 1) {
              this.getImageList(campaign[0].id, campaigns, campIndex);
              this.changeDetectorRef.detectChanges();
          }

          this.apiCampaign = campaign[0];
          this.campaign.imageList[0].url = campaign[0].imageList.length > 0 ? campaign[0].imageList[0].marketingImage : "";
          this.uiCampaign = {
            id: 1,
            campaignId: campaign[0].campaignId,
            campaignName: campaign[0].campaignName,
            campaignBy: campaign[0].campaignBy,
            screen: campaign[0].screen,
            channel: campaign[0].marketingChannel,
            campaignStartDate: campaign[0].campaignStartDate.toString(),
            campaignEndDate: campaign[0].campaignEndDate.toString(),
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

          this.uiCampaign.imageList.pop();

          campaign[0].imageList.forEach(element => {
            this.uiCampaign.imageList.push(
              {
                file: this.testFile,
                url: element.marketingImage,
                imageName: '',
                language: {
                  id: 0,
                  language: ''
                },
                duration: 0,
                priority: 0
              }
            );
          });


          let start = new Date(campaign[0].campaignStartDate);
            let end = new Date(campaign[0].campaignEndDate); 

          this.selectedDateRange = new DateRange(
            new Date(formatDate(start.setDate(start.getDate()),'yyyy-MM-dd', 'en_US')),
            new Date(formatDate(end.setDate(end.getDate()),'yyyy-MM-dd', 'en_US'))
          );

          
          

          this.uiCampaign.imageList.forEach((element,index) => {

            this.uiCampaign.imageList[index].url = campaign[index].imageList[index].marketingImage;
            // this.uiCampaign.imageList[index].url = campaigns[index].imageList[index].marketingImage;
            this.uiCampaign.imageList[index].language =  campaign[index].imageList[index].language;
            this.uiCampaign.imageList[index].duration =  campaign[index].imageList[index].duration;
            this.uiCampaign.imageList[index].priority =  campaign[index].imageList[index].priority;
          // this.uiCampaign.imageList[index].url = this.imageRenderService.base64toSafeUrlBlob(campaigns[index].imageList[index].marketingImage);

          });

          console.log("UI Campaign: ", this.uiCampaign);

        }

        else {
         this.campaignService.getCampaign(this.campaignId)
         .subscribe({
          next: (successResponse) => {
                this.apiCampaign = successResponse;
                this.campaign.imageList[0].url = campaigns[0].imageList.length > 0 ? successResponse.imageList[0].marketingImage : "";

                this.uiCampaign = {
                  id: 1,
                  campaignId: successResponse.campaignId,
                  campaignName: successResponse.campaignName,
                  campaignBy: successResponse.campaignBy,
                  screen: successResponse.screen,
                  channel: successResponse.marketingChannel,
                  campaignStartDate: successResponse.campaignStartDate.toString(),
                  campaignEndDate: successResponse.campaignEndDate.toString(),
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
                  },]
                }
                this.uiCampaign.imageList.pop();

                campaign[0].imageList.forEach(element => {
                  this.uiCampaign.imageList.push(
                    {
                      file: this.testFile,
                      url: element.marketingImage,
                      imageName: '',
                      language: {
                        id: 0,
                        language: ''
                      },
                      duration: 0,
                      priority: 0
                    }
                  );
                });

                this.uiCampaign.imageList.forEach((element,index) => {

                  this.uiCampaign.imageList[index].url = campaign[index].imageList[index].marketingImage;

                this.uiCampaign.imageList[index].url = this.imageRenderService.base64toSafeUrlBlob(campaign[index].imageList[index].marketingImage);

                });


              }
        });

      }

    }

      }
    );
  }

  getImageList(campaignId: Number, campaigns: apiCampaign[], campIndex: number){
    this.campaignService.getCampaignImageList(campaignId)
    .subscribe({
        next: (successResponse) => {
            console.log("ImageList: ", successResponse);
            
            this.apiCampaign?.imageList?.push(...successResponse);
            this.apiCampaign?.imageList.forEach(element => {
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

            this.uiCampaign.imageList.forEach((element,index) => {
        
              console.log("Valid LENGTH: ",campaigns[index].imageList.length);
              if (campaigns[index].imageList.length > 0) 
                {
                  this.uiCampaign.imageList[index].url = campaigns[index].imageList[index].marketingImage;
                  this.uiCampaign.imageList[index].duration = campaigns[index].imageList[index].duration;
                  this.uiCampaign.imageList[index].language = campaigns[index].imageList[index].language;
                  this.uiCampaign.imageList[index].priority = campaigns[index].imageList[index].priority;
                  this.uiCampaign.imageList[index].url = this.imageRenderService.base64toSafeUrlBlob(campaigns[index].imageList[index].marketingImage);

                }
        
            });
            
            campaigns[campIndex].imageList = successResponse;
            localStorage.setItem('campaigns', LZString.compress(JSON.stringify(campaigns)));
            console.log("Local Storage: ", campaigns);
        }
      });
  }

  reLoadImageList() {
    
    console.log("ImageList: ", this.apiCampaign);
    console.log("UI ImageList: ", this.uiCampaign);
    console.log("Campaigns Preview: ", this.campaigns);
    // localStorage.setItem('campaigns', LZString.compress(JSON.stringify(campaigns)));

  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.slides.length - 1;
    }
  }
  navigateToMarketingScreens(campId: string){
      this.router.navigate(['/preview/' + campId]);
  }
  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }

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

  viewCalendar() {
    this.router.navigate(['/view'])
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    event.preventDefault();
    switch (event.keyCode) {
      case 37:
          //left
          event.preventDefault();
          this.previousSlide();
          break;
      case 39:
          //right
          event.preventDefault();
          this.nextSlide();
          break;
  }
    event.stopPropagation();
  }

  toggleAutoplay() {
    this.autoplay = !this.autoplay;
    if (this.autoplay) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  startAutoplay() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayInterval);
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }


  backPreview() {
    this.router.navigate(['/view'])
  }

}
