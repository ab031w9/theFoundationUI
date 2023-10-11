import {OnInit,AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Approval } from 'src/app/models/ui-models/approval.model';
import { LoginService } from 'src/app/services/login.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { Router } from '@angular/router';
import { allCampaign } from 'src/app/models/api-models/campaign-all.model';
import * as LZString from 'lz-string';
import { Campaign } from 'src/app/models/ui-models/campaign.model';

@Component({
  selector: 'app-campaign-approvals',
  templateUrl: './campaign-approvals.component.html',
  styleUrls: ['./campaign-approvals.component.css']
})
export class CampaignApprovalsComponent implements OnInit {

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
                "language": "Zulu"
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
    version: "1.0",
    isTargetted: true,
  "targetData": {
    isTargetRegion: false, 
    targetRegionOrAtm: ''
  }
}];

testFile : any =  {
  lastModified : 1668453753448,
  lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
  name : "Absa logo_Depth_RGB_PNG.png",
  size : 12044,
  type : "image/png",
  webkitRelativePath : ""
}

  displayedColumns: string[] = ['id', 'campaignId', 'campaignName', 'ApprovedBy', 'DateApproved' ,'isApproved', 'approve'];

  dataSource: MatTableDataSource<Approval> = new MatTableDataSource<Approval>();
  @ViewChild(MatPaginator) matPaignator! : MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
  filterString= "";


  APPROVAL_DATA: Approval[] = [];

  approvals: Approval = {
      id: 0,
      campaignId: '',
      campaignName: '',
      ApprovedBy: '',
      DateApproved: new Date(''),
      isApproved: false
    };



  ELEMENT_DATA: Approval[] = [
    { id: 1,
      campaignId: 'CN0000006',
      campaignName: 'Purchase Insurance by scanning the QR Code - UI',
      ApprovedBy: 'Minenhle Mpulo (ZA)',
      isApproved: false
    },
    { id: 2,
      campaignId: 'CN0000007',
      campaignName: 'Test Campaign',
      ApprovedBy: 'Minenhle Mpulo (ZA)',
      DateApproved: new Date('2023-03-18T08:00:43.511Z'),
      isApproved: true
    },
    { id: 3,
      campaignId: 'CN0000009',
      campaignName: 'Valentines Day',
      ApprovedBy: 'Minenhle Mpulo (ZA)',
      DateApproved: new Date('2023-02-11T08:00:43.511Z'),
      isApproved: true
    },
    { id: 4,
      campaignId: 'CN0000012',
      campaignName: 'RBB Pricing 2023',
     // ApprovedBy: 'Minenhle Mpulo (ZA)',
      isApproved: false
    },
  ];
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
  editMode: boolean = true;

  constructor(private loginService: LoginService, private readonly router: Router,private campaignService: CampaignService,  private sharedService: SharedService,private previewDialog: MatDialog) { }

  ngOnInit(): void {

    this.getAllCampaigns();
    let campainApprovalString = localStorage.getItem('campaigns')? localStorage.getItem('campaigns'): "";
    let campaignApprovals: apiCampaign[] = campainApprovalString? JSON.parse(campainApprovalString? LZString.decompress(campainApprovalString): ""): "";
    
    campaignApprovals.forEach( (currentValue) => {
      this.approvals.id = currentValue.id;
      this.approvals.campaignId = currentValue.campaignId;
      this.approvals.campaignName = currentValue.campaignName;
      this.approvals.isApproved = currentValue.isApproved;
      if(currentValue.isApproved && currentValue.lastUpdate)
      {
          this.approvals.ApprovedBy = currentValue.lastUpdate ? currentValue.lastUpdate.updatedBy :  "";
          this.approvals.DateApproved = currentValue.lastUpdate.updatedDate;
      }
      else       
      {
          this.approvals.ApprovedBy = "";
          this.approvals.DateApproved = new Date('');
      }
      

      this.APPROVAL_DATA.push(JSON.parse(JSON.stringify(this.approvals)));
    });

    
    
    if (!!campainApprovalString) this.ELEMENT_DATA = this.APPROVAL_DATA;

    this.dataSource = new MatTableDataSource<Approval>(this.APPROVAL_DATA);
    
    if(this.matPaignator) {
      this.dataSource.paginator = this.matPaignator;
  }
  if(this.MatSort) {
    this.dataSource.sort = this.MatSort;
}
    //Fetch Campaign Approvals
  //   this.campaignService.getCampaignsToBeApproved()
  //   .subscribe({
  //     next: (successResponse) => {
  //       this.approvals = successResponse;
  //       this.dataSource = new MatTableDataSource<Approval>(this.approvals);

  //       if(this.matPaignator) {
  //           this.dataSource.paginator = this.matPaignator;
  //       }
  //       if(this.MatSort) {
  //         this.dataSource.sort = this.MatSort;
  //     }
  //     },
  //    error: (errorResponse) => {
  //       

  //     }
  // });
  }

  filterApprovals(){
      this.dataSource.filter = this.filterString.trim().toLocaleLowerCase();
  }

  async ActivatePreviewDialog(element: any, editMode: boolean = false) {

    // await this.getImageList(element.id);

    const dialogRef = editMode ? this.previewDialog.open(PreviewDialogComponent, {
      width: '60%',
      data: element,
   }) : this.previewDialog.open(EditDialogComponent, {
    autoFocus: false,
    maxHeight: '100vh' ,
    width: '70%',
    data: element,
    });


    dialogRef.afterClosed().subscribe(result => {
     
   });
 }

 ActivateDeleteDialog(element: any) {

  

  const dialogRef = this.previewDialog.open(DeleteDialogComponent, {
    width: '30%',
    data: element,
 });

  dialogRef.afterClosed().subscribe(result => {
   
 });
}

async getImageList(campaignId: Number) {
  const successResponse = await this.campaignService.getCampaignImageList(campaignId);
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


ngAfterViewInit() {
    this.dataSource.sort = this.MatSort;
    this.dataSource.paginator = this.matPaignator;
  }

  getAllCampaigns(): void {
    // -> Get All Campaigns
    
    
    this.campaignService.getCampaigns()
    .subscribe({
     next: (successResponse) => {
            const camps = this.transformCampaigns(successResponse);
            localStorage.setItem('campaigns', LZString.compress(JSON.stringify(camps)));
            
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
