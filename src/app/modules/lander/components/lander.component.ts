import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';

@Component({
    selector: 'ispl-lander',
    templateUrl: 'lander.component.html',
    styleUrls: ['lander.component.css']
  })

  export class LanderComponent implements OnInit {
    userType: string;
    constructor(
        private router: Router,
    ){

    }//end of constructor

    ngOnInit(): void {
    }//end of onInit

    //method to login 
    public redirectToLogin(userTypeParam : string){
      this.userType = userTypeParam;
      console.log("userTypeParam:::::::: ",userTypeParam);
      console.log("redirectToLogin.............");
      this.router.navigate([ROUTE_PATHS.RouteLogin, userTypeParam]);  
    }//end of method
    

  }//end of class