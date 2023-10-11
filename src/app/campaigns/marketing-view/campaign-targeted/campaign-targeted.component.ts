import { Component, OnInit, AfterViewChecked, ChangeDetectorRef  } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ATMData } from '../../../models/api-models/atm-data.model';
import { AtmDataService } from '../../../services/atm-data.service';


@Component({
  selector: 'app-campaign-targeted',
  templateUrl: './campaign-targeted.component.html',
  styleUrls: ['./campaign-targeted.component.css']
})
export class CampaignTargetedComponent implements OnInit, AfterViewChecked {

  myControl = new FormControl('');

  filteredOptions: Observable<string[]> | undefined;
  filterOptions: Observable<string[]> | undefined;
  uniqueRegions: string[] = ['Gauteng',
   'Eastern Cape',
   'Free State','Limpopo','Mpumalanga'];
   uatATMs: string[] = ['08397','S12056','S10031','S13735','S9005',
    'S12835','S12833','S9920','S8104','S8397','S11132',
    'S8421','09830','S8501','S1225'];
   uniqueATMS: string[] = [''];
   
   atms: ATMData[] =  [{
    atmNumber: '',
    serialNumber: '',
    address: '',
    city: '',   
    region: '',
    model: ''
   }];

  controlValid: boolean = false;

  testFile : any =  {
    lastModified : 1668453753448,
    lastModifiedDate : 'Mon Nov 14 2022 21:22:33 GMT+0200 (South Africa Standard Time)',
    name : "Absa logo_Depth_RGB_PNG.png",
    size : 12044,
    type : "image/png",
    webkitRelativePath : ""
  }

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
  }

  isTargets: string[] = ['Yes', 'No'];
  targets: string[] = ['Region', 'ATM'];
  targetType: string = '';
  isTargetedCampaign: string = '';

  constructor(private atmDataService: AtmDataService, private sharedService: SharedService, private readonly changeDetectorRef: ChangeDetectorRef) {

      this.atmDataService
      .getATMData ().subscribe(data => {
          this.atms = data;
          sharedService.atmDataCaptureValue(data);
      }); 
      // this.uniqueATMS = [...new Set(this.atms.map(item => item.atmNumber))];
      console.log("Region DATA: ", this.atms);
   }

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

  ngOnInit(): void {

   this.sharedService.atmDataCaptureData$.subscribe (data => {
      console.log("Region DATA SUBSCR: ",  [...new Set(data.map(item => item.region))]);
      this.uniqueATMS = [...new Set(data.map(item => item.atmNumber + " " + item.address +" - "+ item.city))]
      this.uniqueATMS.push(...new Set(this.uatATMs.map(item => item + " " + " ATM UAT LAB, 268 Republic  " + " - "+ "Randburg")));
      this.uniqueRegions = [...new Set(data.map(item => item.region))];
    });
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filterOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filters(value || '')),
    );
  
  }

  ngAfterViewChecked(): void {
    this.controlValid = !!this.myControl.value ? true : false;
    if (!this.myControl.value) this.controlValid = this.isTargetedCampaign === this.isTargets[1] ? true : false;
    this.changeDetectorRef.detectChanges();
  }

  // Dropdown functionally
  private _filter(value: string): string[] {
    console.log("Region DropDown: ", this.uniqueRegions);
    const filterValue = value.toLowerCase();
    this.apiCampaign.targetData.targetRegionOrAtm = this.uniqueRegions.filter(value => value.toLowerCase().includes(filterValue))[0];
    console.log("SELECTED Region Value: ", this.uniqueRegions.filter(value => value.toLowerCase() == (filterValue)));
    
    return this.uniqueRegions.filter(value => value.toLowerCase().includes(filterValue));
    
  }
  private _filters(value: string): string[] {
    console.log("ATM DropDown: ", this.uniqueRegions);
    const filterValue = value.toLowerCase();
    this.apiCampaign.targetData.targetRegionOrAtm = this.uniqueATMS.filter(atms=> atms.toLowerCase().includes(filterValue))[0].split(' ')[0];
    return this.uniqueATMS.filter(atms=> atms.toLowerCase().includes(filterValue));
  }

  navigateToCapture() {
    
    
    
    this.apiCampaign.isTargetted = this.isTargetedCampaign === this.isTargets[0];
    // this.apiCampaign.channel.channel = this.targetType;
    this.apiCampaign.targetData.isTargetRegion = this.targetType === this.targets[0];
    this.sharedService.updatePreviewCaptureValue(this.apiCampaign);
  }

}
