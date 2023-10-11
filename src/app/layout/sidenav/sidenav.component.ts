import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  isExpanded: boolean = false;
  isAdmin: boolean = false;
  checkAdmin: boolean = false;
  constructor(private auth: LoginService) {
    // this.isExpanded = false;
    this.isAuthenticated = this.auth.isLoggedIn();
    this.auth.captureData$.subscribe((data)=> {
      if (data) {
        this.isAdmin = data.isAdminUser as boolean;
      }            
  });    
  
  if (localStorage.getItem("isAdminUser")?.toString() === "true") {
    this.isAdmin = localStorage.getItem("isAdminUser")?.toString() == "true";
  }
  }

  isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isLoggedIn();
    this.auth.captureData$.subscribe((data)=> {
      if (data) {
        this.isAdmin = data.isAdminUser as boolean;
      }            
  });    
  
  if (localStorage.getItem("isAdminUser")?.toString() === "true") {
    this.isAdmin = localStorage.getItem("isAdminUser")?.toString() == "true";
  }
  }

}
