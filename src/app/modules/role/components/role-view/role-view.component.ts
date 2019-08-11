import { Component, OnInit , OnChanges} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router , ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { ViewRoleDataService } from "../../services/view-role-data.service";
import { ROUTE_PATHS } from '../../../router/router-paths';

@Component({
  selector: 'ispl-role-view',
  templateUrl: 'role-view.component.html',
  styleUrls: ['role-view.component.css']
})
export class ViewRoleComponent implements OnInit {

  public userViewDetails: any = {}//to show the user det in html page
  public title: string = '';//to store page title
  public  modifyRoles: string;//for modify user id
  public routeParam: string = '';
  //for sorting and orderType
  public sortSelection: any = {
    sortData: '',
    orderType: 'NA'
  };

  //busySpinner to load spinner
  public busySpinner: any = {
    submitBusy: false,//for submit spinner
    busy: true
  }

  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;

  //checkbox
  public checkAll : boolean = false;
  public otherCheck : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private viewRoleDataService: ViewRoleDataService,

  ) {
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });   
  }//end of constructor

  ngOnInit(): void {
    this.getRouteParam();//calling method to get route param
    this.getUserViewDetailsValues();//method to get role details
  }//end of onInit

  // ngOnChanges(): void {
  //   console.log("ngOnChanges");
  //   this.getRouteParam();//calling method to get route param
  //   this.getUserViewDetailsValues();//method to get role details
  // }//end of onchanges

    //to load the spinner
   private updateBusySpinner() {
    if (this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //method to get route param
  private getRouteParam(){
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam = params.vieweditparam;
    });
    console.log("routeParam of roole view component: ",this.routeParam); 
    //checking route param is view or modify and set the title according to route param
    // if(this.routeParam === 'view'){
    //   this.title = "View Role";
    // }else if(this.routeParam === 'modify'){
    //   this.title = "Modify Role";
    // } 
  }//end of method

  //method for showing the user details
  private getUserViewDetailsValues(sortData?: string, orderType?: string) {
    // spinner
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();
    this.viewRoleDataService.getRoleViewDetails(this.sortSelection.sortData, this.sortSelection.orderType).
      subscribe(res => {
        console.log("roleViewDetail : ", res),
          this.userViewDetails = res;
          // spinner
    this.busySpinner.submitBusy = false;
    this.updateBusySpinner();
      },
      err => {
        console.log(err);
        // spinner
    this.busySpinner.submitBusy = false;
    this.updateBusySpinner();
      });
  }//end of service call method

  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  public onClick(val) {
    console.log("clicked value : " + val);
    if (this.sortSelection.sortData == val) {
      this.sortSelection.orderType = "DESC";
    } else {
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.getUserViewDetailsValues(this.sortSelection.sortData,
      this.sortSelection.orderType);
      this.selectedData = [];//removing the array
  }//end of onclick method

  //creating method to get user details by single check
  public userDetailsByCheckbox(userDetail) {
    this.roleDetailsByCheckbox(userDetail);

  }
  roleDetailsByCheckbox(userDetail: any) {
    console.log("checked : ", userDetail);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length == 0) {
      //push userDetails obj to selectedData array
      this.selectedData.push(userDetail);
      console.log("selected data : ", this.selectedData);
    } else {
      let indexCount: number = 0;
      let removeFlag:boolean = false;
      for (let selectedData of this.selectedData) {
        if (selectedData.userId == userDetail.userId) {
          this.selectedData.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(userDetail);
      }//end of if
      console.log("selected data after pushing: ", this.selectedData);
    }//end of else

    //checking routeparam is view or not
    if(this.routeParam === 'view'){
      this.viewRole();//calling the method to route 
    }
  }//end of method of roleDetailsByCheckbox


  // //creating a method to check selectAll checkbox
  // selectAllCheck() {
  //   this.checkAll = !this.checkAll;
  //   this.selectedData = (this.checkAll) ? this.userViewDetails.details : [];
  //   console.log("this.selectedData on selectAllCheck method : ", this.selectedData);
  //   if (this.checkAll == true) {
  //     this.otherCheck = true;
  //   } else {
  //     this.otherCheck = false;
  //   }
  // }//end of selectAllCheck method


  
  // //method for add user
  // addUser(){
  //    this.selectedData = [];//removing the array 
  //    // Not authenticated
  //   this.router.navigate([ROUTE_PATHS.RouteAddRole]);
  // }//end of add user method

  //method for edit user
  public editUser(){    
    for(let user of this.selectedData){
      this.modifyRoles = user.roleId;
    }//end of for
    console.log("userId for modify : ",this.modifyRoles);
        
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyRole,this.modifyRoles]);
    // this.router.navigate([ROUTE_PATHS.RouteViewModifyRole,'view',this.modifyRoles]);
  }//end of add user method

  //method for view role
  public viewRole(){ 
    let viewRoles: string = '';   
    for(let user of this.selectedData){
      viewRoles = user.roleId;
    }//end of for
    console.log("roleid for view : ",viewRoles);
        
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteViewRole,viewRoles]);   
  }//end of view role method


  

}//end of class
