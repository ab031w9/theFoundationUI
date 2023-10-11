import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Campaign } from '../../models/ui-models/campaign.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {

  testFile : any =  new File(["foo"], "foo.png", {
    type: "image/png",
  });
  
  Campaigns: Campaign[] = [{
    id: 1,
    campaignId: '',
          campaignName: 'S&I Digital Bonus Rate',
          campaignBy: 'M. Mpulo',
          screen: {
            id: 0,
            screenType: '',
            screenNumber: '3',
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
  } ];
  
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email', 'mobile',
   'gender', 'edit'];
   dataSource: MatTableDataSource<Campaign> = new MatTableDataSource<Campaign>();
   @ViewChild(MatPaginator) matPaignator! : MatPaginator; 
   @ViewChild(MatSort) MatSort!: MatSort;
   filterString= "";

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {

    //DummyData Display
    this.dataSource = new MatTableDataSource<Campaign>(this.Campaigns);

    if(this.matPaignator) {
        this.dataSource.paginator = this.matPaignator;
    }
    if(this.MatSort) {
      this.dataSource.sort = this.MatSort;
  }
    
    //Fetch Campaigns
  //   this.campaignService.getCampaigns()
  //   .subscribe({
  //     next: (successResponse) => {
  //       this.Campaigns = successResponse;
  //       this.dataSource = new MatTableDataSource<Campaign>(this.Campaigns);

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

  filterCampaigns(){
      this.dataSource.filter = this.filterString.trim().toLocaleLowerCase();
  }

}
