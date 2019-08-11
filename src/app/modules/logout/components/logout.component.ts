import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { Router } from "@angular/router";
import { ROUTE_PATHS } from "../../router/router-paths";
import { LogoutService } from "../services/logout.service";

@Component({
  selector: 'ispl-logout',
  templateUrl: 'logout.component.html',
  styleUrls: ['logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private logoutService: LogoutService
  ) {

  }

  ngOnInit(): void {
    console.log("Logout Component... !");
    this.userLogout();
    this.router.navigate([ROUTE_PATHS.RouteLander]);
  }
  //for deleting user details for logout
  private userLogout(){
    this.logoutService.userLogout().
    subscribe(res => {
      console.log(" logout service called",res);
      this.localStorageService.user = undefined;
    },
    err => {
      console.log(err);
      this.localStorageService.user = undefined;      
    });
  }//end of the method

}
