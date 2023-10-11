import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {

  chart = new Chart({
    chart: {
      type: 'pie',
      height: 225
    },
    title: {
      text: 'Category - [Name]'
    },
    xAxis: {
      categories: [
        'ClientCode',
        'TellerNumber',
        'SiteName',
        'BranchCode',
        'ApplicationVersionNumber',
      ]
    },
    yAxis: {
      title: {
        text: 'Revenue in %'
      }
    },
    series: [
     {
      type: 'pie',
      data: [
        {
          name: 'ClientCode',
          y: 41.0,
          color: '#044342',
        },
        {
          name: 'TellerNumber',
          y: 33.8,
          color: '#7e0505',
        },
        {
          name: 'SiteName',
          y: 6.5,
          color: '#ed9e20',
        },
        {
          name: 'BranchCode',
          y: 15.2,
          color: '#6920fb',
        },
        {
          name: 'ApplicationVersionNumber',
          y: 3.5,
          color: '#121212',
        },
      ]
     }
    ],
    credits: {
      enabled: false
    }
  })

  constructor() { }

  ngOnInit(): void {
  }

}
