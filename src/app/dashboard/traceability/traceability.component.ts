import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-traceability',
  templateUrl: './traceability.component.html',
  styleUrls: ['./traceability.component.css']
})
export class TraceabilityComponent implements OnInit {

  // var passed = 60;
  // var failed = 40;

  myChart = new Chart({
    chart: {
      renderTo: 'chart',
      type: 'column'
  },
  title: {
    text: 'ATM Marketing Campaigns that are targeted'
  },
  xAxis: {
    categories: [
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'Northern Cape',
      'North West'
    ],
    crosshair: true,
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Campaigns'
    }
  },
  series: [{
    name: 'Region',
    type: 'column',
    data: [106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
      194.1]

  }, {
    name: 'ATM',
    type: 'column',
    data: [52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8,
      51.1]

  }]

});


  constructor() { }

  ngOnInit(): void {
  }

}
