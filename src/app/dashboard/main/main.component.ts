import { Component, OnInit, HostListener } from '@angular/core';
import {
  faPencil,
  faProjectDiagram,
  faDashboard,
  faComputer,
  faCartShopping,
  faCartArrowDown,
  faBank,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  faLocation = faPencil;
  faShop = faBank;
  faBoxes = faProjectDiagram;
  faMoneyBill = faDashboard;

  results = ["1"];

  details : any;
  columnNames: any;
  width: any;
  height: any;

  constructor() { }

  ngOnInit() {
    
    this.generateCharts();
    

  }

  generateCharts() {
    this.details = [];
    for(let i=0;i<this.results.length;i++)
    {
      this.details.push(this.drawChart(i));
    }
  }
  drawChart(index:any) : any{
    var passed;
    var failed;
   if(index == 0)
    {
      passed=100;
      failed=0;
    }
    else if(index == 1)
    {
      passed=20;
      failed=30;
    }
    else if(index == 2)
    {
      passed=40;
      failed=60;
    }

    return {
        chart: {
            renderTo: 'chart'+index,
            type: 'pie'
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
        },
        credits: false,
        plotOptions: {
            pie: {
                shadow: false
            }
        },
        series: [{
            name: 'Pass/Fail',
            data: [["Pass",passed],["Fail",failed]],
            size: '60%',
            innerSize: '90%',
            showInLegend:true,
            dataLabels: {
                enabled: false
            }
        }]
    };
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.generateCharts()
  }


}
