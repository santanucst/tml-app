import { Component, Input, Compiler, OnInit } from '@angular/core';
// import { APP_DASHBOARD_ANIMATIONS } from "../../shared/components/animations/app-animations";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';
@Component({
  selector: 'ppr-dashboard-batch',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  // animations: APP_DASHBOARD_ANIMATIONS
})
export class DashboardComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router) {
    console.log("Dashboard Batch Constructor...");
  }

  ngOnInit() {
    this.routeByUserType();
  }

  private routeByUserType() {
    // let userType: string  =  this.localStorageService.user.userType;
    if(this.localStorageService.user.userType && this.localStorageService.user.userType==='V'){
      this.router.navigate([ROUTE_PATHS.RoutePODetView]);
    }
  }



}//end of class
