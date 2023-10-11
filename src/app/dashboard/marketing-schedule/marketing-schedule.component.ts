import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';



@Component({
  selector: 'app-marketing-schedule',
  templateUrl: './marketing-schedule.component.html',
  styleUrls: ['./marketing-schedule.component.css']
})
export class MarketingScheduleComponent implements OnInit {


  constructor() { }

   ngOnInit() {

  }


  chart = new Chart({
    chart: {
      type: 'line',
      height: 325
    },
    title: {
      text: '[Name]'
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

}
