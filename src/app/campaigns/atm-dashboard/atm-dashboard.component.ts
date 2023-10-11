import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  faPencil,
  faProjectDiagram,
  faHandshake,
  faBullseye,
  faPenToSquare,
  faMicrochip,
  faHandshakeSlash,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Chart, MapChart } from 'angular-highcharts';
import {DashboardScheduleVersions} from '../../models/ui-models/dashboard-schedule-versions.model';
import {DashboardSAMap} from '../../models/ui-models/dashboard-saMap.model';
import { DashboardBarChart } from 'src/app/models/ui-models/dashboard-bar-chart.model';
import { DashboardService } from 'src/app/services/dashboard.service';


import  saMap from 'src/assets/saMap.json'
@Component({
  selector: 'app-atm-dashboard',
  templateUrl: './atm-dashboard.component.html',
  styleUrls: ['./atm-dashboard.component.css']
})
export class AtmDashboardComponent implements AfterViewInit {


  faLocation = faPenToSquare;
  faShop = faMicrochip;
  faBoxes = faBullseye;
  faMoneyBill = faHandshakeSlash;
  faCurrent = faCodeBranch;
  displayedColumns: string[] = ['atm', 'address', 'region', 'version'];
  provinceMap = new Map([
    ['Limpopo', 'ZA.NP'],
    ['Mpumalanga', 'ZA.MP'],
    ['Gauteng', 'ZA.GT'],
    ['Gauteng South', 'ZA.GT'],
    ['Gauteng North', 'ZA.GT'],
    ['North West', 'ZA.NW'],
    ['Free State', 'ZA.FS'],
    ['KwaZulu-Natal', 'ZA.NL'],
    ['Eastern Cape', 'ZA.EC'],
    ['Western Cape', 'ZA.WC'],
    ['Northern Cape', 'ZA.NC']
  ]);

  dataSource:  MatTableDataSource<DashboardScheduleVersions> = new MatTableDataSource<DashboardScheduleVersions>();
  @ViewChild(MatPaginator) matPaignator! : MatPaginator;
  filterString= "";
  total!: Number;
  schedule!: Number;
  failed!: Number;
  device!: Number;
  current!: string;

  atm_data: DashboardScheduleVersions[] = [

      {atmNumber: '', region: '', address: '', scheduleVersion: ''}

  ];

  bar_data: DashboardBarChart = {
    province: [],
    provinceLatestVersionValue: [],
    provincePreviousVersionValue: [],
    provinceCurrentVersionValue: [],
    provinceFailedVersionValue: []
  };

  dataMaps: DashboardSAMap = {
    province: [
      'ZA.NP',
      'ZA.MP',
      'ZA.GT',
      'ZA.NW',
      'ZA.FS',
      'ZA.NL',
      'ZA.EC',
      'ZA.WC',
      'ZA.NC'
    ],
    provinceValue: [0,0,0,0,0,0,0,0,0]
   }
  
   mapData: any =  [
    ['ZA.NP', this.dataMaps.provinceValue[0]],
    ['ZA.MP', this.dataMaps.provinceValue[1]],
    ['ZA.GT', this.dataMaps.provinceValue[2]],
    ['ZA.NW', this.dataMaps.provinceValue[3]],
    ['ZA.FS', this.dataMaps.provinceValue[4]],
    ['ZA.NL', this.dataMaps.provinceValue[5]],
    ['ZA.EC', this.dataMaps.provinceValue[6]],
    ['ZA.WC', this.dataMaps.provinceValue[7]],
    ['ZA.NC', this.dataMaps.provinceValue[8]]
  ]

  constructor(private readonly dashboardService: DashboardService) { }


  dashboardInfo!: any;
  barInfo!: any;
  saMapInfo!: any;
  localMap!: any;
  lineMapInfo!: any;

  ngOnInit(): void {

     // -> Get method to fetch all CampaignLookups from Service
       this.dashboardService.getWidgets()
       .subscribe({
        next: (successResponse) => {
          this.dashboardInfo = successResponse;
          console.log("Dashboard OBJ: ", successResponse);
          
          this.total = this.dashboardInfo.totalCampaigns;
          this.schedule = this.dashboardInfo.latestScheduleCount;
          this.failed = this.dashboardInfo.failedUploadSchedulesCount;
          this.device = this.dashboardInfo.totalDevices;
          this.current = this.dashboardInfo.currentVersion;
          this.atm_data = this.dashboardInfo.atmScheduleResultVersions;
          this.barInfo = this.dashboardInfo.regionalSchedules;
          this.saMapInfo = this.dashboardInfo.chartBars;
          this.dataSource = new MatTableDataSource<DashboardScheduleVersions>(this.atm_data);
          localStorage.setItem('atm_data', JSON.stringify(this.atm_data));
          localStorage.setItem('bar_chart', JSON.stringify(this.barInfo));
          if(this.matPaignator) {
            this.dataSource.paginator = this.matPaignator;
          }

          let mapDataLocal = localStorage.getItem('map_data')? localStorage.getItem('map_data'):"";
          
          if (!!mapDataLocal) this.localMap = JSON.parse(mapDataLocal? mapDataLocal: "");

          if (!this.localMap){
          
          this.saMapInfo.province.forEach((province: string) => {
      
            console.log("Province Map: ", province);
            const groupedProvinceCode = 'ZA.GT';
            const provinceCode = this.provinceMap.get(province);
            if (provinceCode && provinceCode!= groupedProvinceCode) {
              this.dataMaps.provinceValue[this.dataMaps.province.indexOf(provinceCode)] = this.saMapInfo.provinceLatestVersionValue[this.saMapInfo.province.indexOf(province)];
            } else {

              if (provinceCode == groupedProvinceCode && this.dataMaps.provinceValue[this.dataMaps.province.indexOf(provinceCode)] > 0) {
                this.dataMaps.provinceValue[this.dataMaps.province.indexOf(provinceCode)] = this.dataMaps.provinceValue[this.dataMaps.province.indexOf(provinceCode)] + this.saMapInfo.provinceLatestVersionValue[this.saMapInfo.province.indexOf(province)];
              }
              else if (provinceCode == groupedProvinceCode && this.dataMaps.provinceValue[this.dataMaps.province.indexOf(provinceCode)] == 0) {
                this.dataMaps.provinceValue[this.dataMaps.province.indexOf(provinceCode)] = this.saMapInfo.provinceLatestVersionValue[this.saMapInfo.province.indexOf(province)];
              }
    
            }
          
          });
          localStorage.setItem('map_data', JSON.stringify(this.dataMaps));
          console.log("SA MAP DATA MAPPED: ", this.dataMaps);
        }
           }
      });
      let localAtm = localStorage.getItem('atm_data')? localStorage.getItem('atm_data'):"";
      if (!!localAtm) this.atm_data =  JSON.parse(localAtm? localAtm: "");
      
      this.dataSource = new MatTableDataSource<DashboardScheduleVersions>(this.atm_data);
      if(this.matPaignator) {
        this.dataSource.paginator = this.matPaignator;
      }

      let mapDataLocal = localStorage.getItem('map_data')? localStorage.getItem('map_data'):"";
      if (!!mapDataLocal) {
      this.localMap =  JSON.parse(mapDataLocal? mapDataLocal: "");
      this.localMap.provinceValue.forEach((element: any, index: number) => {
          this.mapData[index][1] = element;
      });
3
      console.log("MAP DATA: ", this.mapData);
      }
      let local = localStorage.getItem('bar_chart')? localStorage.getItem('bar_chart'):"";
      if (!!local) {
      this.barInfo =  JSON.parse(local? local: "");
      this.barInfo.forEach((element: any) => {
         this.bar_data.province.push(element.region);
         this.bar_data.provinceLatestVersionValue.push(element.totalSuccessfulUploads);
         this.bar_data.provincePreviousVersionValue.push(element.totalFailedUploads);
         this.bar_data.provinceCurrentVersionValue.push(element.successfulCurrentScheduleUploads);
         this.bar_data.provinceFailedVersionValue.push(element.failedCurrentScheduleUploads);
      });
      console.log("BAR INFO: ", this.bar_data);
    }
      
  }


  //@ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.matPaignator;
    

  }
//First Chart
  myChart = new Chart({
    chart: {
      renderTo: 'chart',
      type: 'bar',
      height: 425
  },
  title: {
    style: {
      color: '#8F466A'
    },
    text: 'ATMs With Installed Versions By Region'

  },
  colors: ['#640032', '#ca0065',  '#FF7900', '#FF002E' ],
  credits: {
    enabled: false
  },
  xAxis: {
    // categories: [
    //   'Eastern Cape',
    //   'Free State',
    //   'Gauteng',
    //   'KwaZulu-Natal',
    //   'Limpopo',
    //   'Mpumalanga',
    //   'Northern Cape',
    //   'North West'
    // ],
    categories: this.bar_data.province,
    // crosshair: true,
    accessibility: {
      description: 'Profession'
    }
  },
  yAxis: {
    min: 0,
    max: 50,
    title: {
      text: 'Campaigns'
    }
  },
  plotOptions: {
  column: {
    pointWidth: 12,
     stacking: 'normal'
    },
    bar: {
      pointPadding: 0.1,
      borderWidth: 0,

    }
  },
  series: [{
    name: 'ATMs with lastest schedule',
    type: 'column',
    data: this.bar_data.provinceLatestVersionValue as number[]

  }, {
    name: 'ATMs with failed uploads',
    type: 'column',
    data: this.bar_data.provinceFailedVersionValue as number[]

  },{
    name: 'ATMs on current lastest schedule',
    type: 'column',
    data: this.bar_data.provinceLatestVersionValue as number[]

  }, {
    name: 'ATMs current failed uploads',
    type: 'column',
    data: this.bar_data.provincePreviousVersionValue as number[]

  }]

});


//Last chart
lastChart = new Chart({
  chart: {
    type: 'line',
    height: 424

  },
  title: {
    style: {
      color: '#8F466A'
    },
    text: 'Type of Receiver Devices'
  },
  xAxis: {
    categories: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ]
  },
  yAxis: {
    title: {
      text: 'Performance'
    }
  },
  series: [
    {
      name: "ATM",
      type: "line",
      color: '#044342',
      data: [70, 69, 95, 145, 182, 215, 252]
    },
    {
      name: 'SSK',
      type: 'line',
      color: '#7e0505',
      data: [
        47, 52, 44, 35, 58, 69, 32]
    },
    {
      name: 'BCD',
      type: 'line',
      color: '#ed9e20',
      data: [
        17, 22, 14, 25, 18, 19, 22
      ]
    },
  ],
  credits: {
    enabled: false
  }
});

//Map
myMapChart = new MapChart({
  chart: {
    map: saMap,
    height: 423
  },
  title: {
    style: {
      color: '#8F466A'
    },
    text: 'Targeted Campaigns by Region'
  },
  accessibility: {
      typeDescription: 'Map of South Africa.'
    },
    // legend: {
    //   layout: 'vertical',
    //   align: 'left',
    //   floating: true,
    //   backgroundColor: 'rgba(255, 255, 255, 0.85)'
    // },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    colorAxis: {
      min: 1,
      // type: 'logarithmic',
      minColor: '#F1EEF6',
      maxColor: '#500007',
      stops: [
        [0, '#F1EEF6'],
        [0.67, '#900037'],
        [1, '#500007']
      ]
    },
    exporting: {
      sourceWidth: 650,
      sourceHeight: 900
    },

    credits: {
      enabled: false
  },

    series: [{
      type: 'map',
      data:  this.mapData,
      //data: this.dataMaps,
      keys: ['hasc', 'value'],
      joinBy: 'hasc',
      name: 'Campaign',
      states: {
        hover: {
          color: '#a4edba'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.properties.postal-code}'
      }
    }]

});


filterApprovals(){
  this.dataSource.filter = this.filterString.trim().toLocaleLowerCase();
}



}

