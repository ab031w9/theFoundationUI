import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectArg, EventApi, EventClickArg, CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { SharedService } from 'src/app/services/shared.service';
import { EncryptionService } from 'src/app/services/encryptionservice.service';
import {formatDate} from '@angular/common';
import { isEmpty } from 'rxjs';
import * as LZString from 'lz-string';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-marketing-logs-view',
  templateUrl: './marketing-logs-view.component.html',
  styleUrls: ['./marketing-logs-view.component.css']
})

export class MarketingLogsViewComponent implements OnInit, AfterViewInit {

  testFile : any =  {
    lastModified : 1668453753448,
    lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
    name : "Absa logo_Depth_RGB_PNG.png",
    size : 12044,
    type : "image/png",
    webkitRelativePath : ""
  }

  campaigns!: apiCampaign[];
  apiCampaign: apiCampaign[] = [
    {
    id: 0,
    campaignId: "CN0000010",
    campaignName: "Valentine's Day",
    campaignBy: "Minenhle Mpulo (ZA)",
    screen: {
      "id": 0,
      "screenType": "Transactional",
      "screenNumber": "Screen 2",
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
        updatedBy: "",
        updateDescription: "",
        approvalId: 0
    },
    updatedBy: "",
    isActive: false,
    isApproved: false,
     version: '1.0',
          targetData: {
            isTargetRegion: false,
            targetRegionOrAtm: ''
          },
    isTargetted: true
},
{
  "id": 0,
  "campaignId": "CN0000012",
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
      "updatedBy": "",
      "updateDescription": "",
      "approvalId": 0
  },
  "updatedBy": "",
  "isActive": false,
  "isApproved": false,
  "version": "1.0",
  "isTargetted": true,
  "targetData": {
    isTargetRegion: false,
    targetRegionOrAtm: ''
  }
}];
  colors : any = ['red','blue','green','orange', 'purple' , 'black', 'grey']
  currentEvents: EventApi[] = [];
  objColor!: string;

  calendarOptions = {
    initialView: 'dayGridMonth',
    weekends: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: false,
   // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    height: 450,
    plugins: [dayGridPlugin, interactionPlugin],
    //dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
      { title: 'S&I Digital Bonus Rate',
        start: '2022-11-15',
        end: '2022-11-23'
      }
      , { title: 'World Aids Day', start: '2022-11-04', end: '2022-11-17', color: 'red', display: 'block' }
      , { title: 'RBB Pricing 2023', start: '2022-11-21', end: '2022-12-15', color: 'green' }
      , { title: 'Fraud awareness ', start: '2022-11-26', end: '2022-12-02', color: 'black' }
    ],
    headerToolbar: {
      //left: 'prev,next today',//
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      color:  '#b91220'
    },
    
    customButtons: {
        previousMonth: {
            text: 'Previous',
            icon: 'chevron-left',
            click: this.handlePreviousMonthClick
        },
        nextMonth: {
            text: 'Next',
            icon: 'chevron-right',
            click: this.handleNextMonthClick,
        }
    }
  }

  @ViewChild('fullCalendar') fullCalendarComponent: FullCalendarComponent | undefined;


  selectedDateRange!: DateRange<Date>;
  isAdmin:string = "";
  constructor(private readonly campaignService: CampaignService, private snackbar:ToastrService, private readonly route: ActivatedRoute, private encryptionService: EncryptionService,
  private readonly router: Router, private changeDetector: ChangeDetectorRef,
  private sharedService: SharedService) { 
    let admin = localStorage.getItem("isAdminUser");
    let token = localStorage.getItem("token");
    this.isAdmin = admin ? admin : "";
    if (this.isAdmin && token == "Business Approver")     this.snackbar.info(`You Have Outstanding Campaign Approvals  `,'Please Approve Campaigns', 
    {
      timeOut: 10000,
      tapToDismiss: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left'
    });
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params) => {
        this.apiCampaign[this.apiCampaign.length - 1].imageList.push(this.apiCampaign[this.apiCampaign.length - 1].imageList[0]);


        // let campainsString = localStorage.getItem('calendar-camp')? localStorage.getItem('calendar-camp'): "";
        let localCampaignString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
        // this.sharedService.createCampaignData$.subscribe(data=> {
        //       this.apiCampaign = data as apiCampaign[];
        //       console.log("Campaigns Data: ", data);
        //       localStorage.setItem('campaigns', LZString.compress(JSON.stringify(this.apiCampaign)));
        // });
        

        if (!localCampaignString) 
            {
                  this.sharedService.createCampaignData$.subscribe(data=> {
                  this.apiCampaign = data as apiCampaign[];
                  console.log("IF Campaigns Data: ", data);
                  localStorage.setItem('campaigns', LZString.compress(JSON.stringify(this.apiCampaign)));                          
              });
            }
        else 
            {
                  this.apiCampaign = JSON.parse(localCampaignString? LZString.decompress(localCampaignString): "");
                  console.log("ELSE Local Data: ", this.apiCampaign);
                  // localStorage.setItem('campaigns', JSON.stringify(this.apiCampaign));
            }

        this.apiCampaign.forEach((campaign, index) => 
            {
              let start = new Date(campaign.campaignStartDate);
              let end = new Date(campaign.campaignEndDate);
                if(campaign.isApproved == true)
                  { 
                    this.objColor =  this.colors[2];
                  }
                else
                  {
                    this.objColor = this.colors[6];}
                    let event =   {
                                      id: campaign.campaignId,
                                      title: campaign.campaignName + ' ( ' + campaign.marketingChannel.channel+ ' '+ campaign.screen.screenType + ' ' + campaign.screen.screenNumber + ' )',
                                      start: formatDate(start.setDate(start.getDate()),'yyyy-MM-dd', 'en_US'),
                                      end: formatDate(end.setDate(end.getDate() + 1),'yyyy-MM-dd', 'en_US'),
                                      color: this.objColor,
                                      display: 'block', 
                                  }

                this.calendarOptions.events.push(event);
        });

      }
    );
          
     // -> Get method to fetch all CampaignLookups from Service
     this.campaignService.getCampaignLookup()
     .subscribe({
      next: (successResponse) => {
        
      localStorage.setItem("campaign-lookup", JSON.stringify(successResponse.languages));

      }
    });
  }

  _onSelectedChange(date: Date): void {
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
      
      
    } else {
      this.selectedDateRange = new DateRange(date, null);
      
      
    }
  }
  

  onUpdate(): void {

    // Call campaign service to update campaign

  }

  onDelete(): void {

    // Call campaign service to delete campaign

  }
  onAdd(): void {

    // Call campaign service to delete campaign

  }
  ngAfterViewInit(): void {
    // 
  }

 // handleDateClick() {
    // alert('date click! ')
    //alert(this.fullCalendarComponent?.options?.eventClick?.toString());
    // 

   // this.snackbar.open("Navigating to Preview Campaign", undefined,
         //  {
         //   duration: 2000,
          //  panelClass: ['mat-toolbar', 'mat-primary']
        //   });
         //  setTimeout(()=>{
          //  this.router.navigateByUrl('campaigns');
       //    }, 2000);
 // }

  resetCalendarLocalStorage() {
    localStorage.removeItem('calendar-camp');
  }

  handlePreviousMonthClick(): void {
    alert(this.fullCalendarComponent);
    
    // let calendarApi = this.fullCalendarComponent.getApi();
    // calendarApi.prev();
    // TODO: Implement handlePreviousMonthClick() function...
  }

  handleNextMonthClick(): void {
    alert(this.fullCalendarComponent);
    
    // let calendarApi = this.fullCalendarComponent.getApi();
    // calendarApi.next();
    // TODO: Implement handleNextMonthClick() function...
  }
 // handleDateSelect(selectInfo: DateSelectArg) {   //Adding New Events Via Calendar
    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: '',
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
 // }

  handleEventClick(clickInfo: EventClickArg) {

    this.snackbar.info(`Navigating to Preview Campaign -> ${clickInfo.event.title}' `, undefined,
           {
            timeOut: 3000,
           });
           setTimeout(()=>{
           }, 2000);
           
           
           let thisCampaign = this.apiCampaign.filter(event => event.campaignId = clickInfo.event.id);
           
           //Call Preview using selected Campaign (thisCampaign)
           this.previewCampaign(thisCampaign[0].campaignId)
           
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  addCampaign() {
    this.router.navigate(['/campaign/add'])
  }

  navigateToNavBar() {
    this.router.navigate(['/nav']);
  }

  previewCampaign(campaignId: string) {
    this.router.navigate(['/preview/' + campaignId])
  }

  getAllCampaigns(): void {
    // -> Get All Campaigns
    

    this.campaignService.getCampaigns()
    .subscribe({
     next: (successResponse) => {
            localStorage.setItem('campaigns', LZString.compress(JSON.stringify(successResponse)));
            this.sharedService.updateCreateCampaignValue(successResponse);
            
         },

      error: (errorRespo) => {
        
      }
   });
}

async testEncryption() {
  try {
    const encryptedData = await this.encryptionService.encrypt('Hello, world!');
    localStorage.setItem('encrypted', JSON.stringify(encryptedData));

    const retrievedData = JSON.parse(localStorage.getItem('encrypted') || '');
    const decryptedData = await this.encryptionService.decrypt(retrievedData);
    
  } catch (error) {
    console.error('Error during encryption or decryption', error);
  }
}

}

