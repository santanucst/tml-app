import { Component, NgModule, Output, EventEmitter, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { ToastrConfig, ToastrService } from "ngx-toastr";
import { ROUTE_PATHS } from '../../router/router-paths';
import { ToastService } from "../services/toast-service";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { UserModel } from "../../shared/models/user-model"; 
import { MenuWsMapModel } from "../models/menu-ws-map.model";
import { ItemDetailsService } from "../../purchase-order/services/item-details.service";
import { PurchaseOrderInteractionService } from "../../purchase-order/services/purchase-order-interaction.service";

@Component({
    selector: 'ispl-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']

})
export class HomeComponent implements OnInit, AfterViewInit {

  public tempRoleMenu: string = '';
  public loggedInUser: UserModel;
  public pageNavigation: any; 
  public menuIcons:any;
  public navMenuList:any;
  public tempRoleType: string = '';//for change plant type menu
  public isNew: string = '';

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    // private toastrConfig: ToastrConfig,
    private toastService: ToastService,
    private itemDetailsService: ItemDetailsService,
    private purchaseOrderInteractionService: PurchaseOrderInteractionService,
    private localStorageService: LocalStorageService
    ) {

    this.tempRoleMenu = this.localStorageService.user.roleName;
    this.loggedInUser = this.localStorageService.user;

    // this.toastrConfig.positionClass = 'toast-bottom-center';
    // this.toastrConfig.tapToDismiss = true;
    this.toastService.toastElementRef = this.toastrService;
  }

  ngOnInit() {
    // this.toastrService.success('You have successfully logged in!', 'Congratulation!');
    console.log("home component..........................................");
    this.isNew = this.localStorageService.user.isNew;
    this.setMenu();
    this.checkUserType();//check user type and route
    
  }//end of onInit

  ngAfterViewInit(){
  }

  private setMenu() {
    console.log("set menu method/////////////////////");
    this.pageNavigation = new MenuWsMapModel().userMenu;
    this.menuIcons = new MenuWsMapModel().userMenuIcons;
    this.navMenuList = this.localStorageService.appSettings.getMenuDetails;
    console.log("App Menu Response in home component::::" ,this.navMenuList);
  }

  //method to check user type and route
  private checkUserType() {
    if(this.isNew === 'N'){
      if(this.localStorageService.user.userType && this.localStorageService.user.userType==='V'){
        this.router.navigate([ROUTE_PATHS.RoutePODetView]);
      }
    }
  }//end of method

  setLocalStoragevariable(subId:string){
    console.log(" subId =======>>>>>>>>>",subId);
    if(subId === "SSM0000012" || subId === "SSM0000013" || subId === "SSM0000018" ){//for ivoice, credit , debit add
      this.itemDetailsService.testVar ="";
    }else if(subId === "SSM0000017"){//for po View
      this.purchaseOrderInteractionService.filterData = "";
    }
  }//end of method

  logout() {
    console.log("Log out");
  }

}
