import { Component, OnInit } from '@angular/core';
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
  selector: 'app-top-widgets',
  templateUrl: './top-widgets.component.html',
  styleUrls: ['./top-widgets.component.scss']
})
export class TopWidgetsComponent implements OnInit {

  faLocation = faPencil;
  faShop = faBank;
  faBoxes = faProjectDiagram;
  faMoneyBill = faDashboard;

  constructor() { }

  ngOnInit(): void {
  }

}
