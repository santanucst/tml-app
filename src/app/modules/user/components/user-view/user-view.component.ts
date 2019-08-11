import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router , ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { ViewUserDataService } from "../../services/view-user-data.service";
import { ROUTE_PATHS } from '../../../router/router-paths';

@Component({
  selector: 'ispl-user-view',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.css']
})
export class ViewUserComponent implements OnInit {

  public userViewDetails: any = {}//to show the user det in html page

  public  modifyUsers: string;//for modify user id

  //for error msg
  public resErrFlag: boolean = false;
  public resErrorMsg: string;
  public routeParam: string = '';
  //for sorting and orderType
  public sortSelection: any = {
    sortData: '',
    orderType: ''
    // 'NA'
  };

  //takin arr for selectedData
  public selectedData: any[] = [];

  //to search
  public searchFormGroup: FormGroup;
  public gridSearch: FormControl;

  //checkbox
  public checkAll : boolean = false;
  public otherCheck : boolean = false;

  //busySpinner to load spinner
  public busySpinner: any = {
    submitBusy: false,//for submit spinner
    busy: true
  }

  constructor(
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private viewUserDataService: ViewUserDataService,
     private router: Router

  ) {
    this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }

  ngOnInit(): void {
    this.getRouteParam();//calling method to get route param
    this.getUserViewDetailsWS();//calling service class method to get data of all user 
  }//end of onInit

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

   //to load the spinner
   private updateBusySpinner() {
    if (this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //method for showing the user details
  private getUserViewDetailsWS(sortData?: string, orderType?: string) {
    // spinner
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();

    this.viewUserDataService.getUserViewDetails(this.sortSelection.sortData, this.sortSelection.orderType).
      subscribe(res => {
        console.log("userViewDetail : ", res);
        if(res.msgType === 'Info'){
          this.userViewDetails = res;
        }else{
          //for showing err msg
          this.resErrFlag = true;
          this.resErrorMsg = res.msg;
        }
        // spinner
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();

      },
      err => {
        console.log(err);
        //for showing err msg
        this.resErrFlag = true;
        this.resErrorMsg = "unable to load data!";
        // spinner
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();

      });
  }//end of service call method

  //method to get userdetails by checkbox
  private getUserDetailsByCheckbox(userDetail: any) {
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
      this.viewUser();//calling the method to route 
    }
  }//end of method of getUserDetailsByCheckbox

  //creating method to get user details by single check
  public userDetailsByCheckbox(userDetail) {
    this.getUserDetailsByCheckbox(userDetail);
  }//end of method

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
    this.getUserViewDetailsWS(this.sortSelection.sortData,
      this.sortSelection.orderType);
      this.selectedData = [];//removing the array
  }//end of onclick method

  //creating a method to check selectAll checkbox
  public selectAllCheck() {
    this.checkAll = !this.checkAll;
    this.selectedData = (this.checkAll) ? this.userViewDetails.details : [];
    console.log("this.selectedData on selectAllCheck method : ", this.selectedData);
    if (this.checkAll == true) {
      this.otherCheck = true;
    } else {
      this.otherCheck = false;
    }
  }//end of selectAllCheck method

  //creating a method to delete user
  public activateDeactivateUser(status){
    let statusLowerCaseValue: string = status.toLowerCase( );
    console.log(status+ " method.. ");
      if(confirm("Are you sure, want to "+statusLowerCaseValue+" the record(s) ? ") == true){
        let activateDeactivateUsers: string = 'users=';
        // let 
        let lastElement:any = this.selectedData[this.selectedData.length-1];
        console.log("lastElement:::",lastElement);
        for(let user of this.selectedData){
          activateDeactivateUsers = activateDeactivateUsers + user.userId;
          if(!(lastElement.userId === user.userId)){
            activateDeactivateUsers = activateDeactivateUsers + ",";
          }
        }//end of for
        console.log("users to activate/deactivate : ",activateDeactivateUsers);
        this.selectedData = [];//removing the array
      //method call from service class
      this.viewUserDataService.activateDeactivateUser(status,activateDeactivateUsers).
      subscribe(res => {
          console.log("updated data : ", res);
          if (res.msgType === "Info") {
            this.getUserViewDetailsWS();            
          } else {
            //for showing err msg
            this.resErrFlag = true;
            this.resErrorMsg = res.msg;
            // "Netowrk/Server Problem. Please try again.";
          }//end of else
          //to uncheck all checkbox
          this.checkAll = true;
          this.selectAllCheck();//calling the method to uncheck 
        },
        err => {
          console.log(err);
          this.checkAll = true;
          this.selectAllCheck();//calling the method to uncheck 
          //for showing err msg
          this.resErrFlag = true;
          this.resErrorMsg = "Unable to update data!";          
        });
      }//end of if confirm
  }//end of user deletion method

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
   this.resErrFlag = false;
  }//method to delete error msg

  // //method for add user
  // public addUser(){
  //    this.selectedData = [];//removing the array 
  //    // Not authenticated
  //   this.router.navigate([ROUTE_PATHS.RouteAddUser]);
  // }//end of add user method

  //method for edit user
  public editUser(){    
    for(let user of this.selectedData){
      this.modifyUsers = user.userId;
    }//end of for
    console.log("userId for modify : ",this.modifyUsers);
        
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyUser,this.modifyUsers]);
  }//end of add user method

  //method for view user
  public viewUser(){ 
    let viewUser: string = '';   
    for(let user of this.selectedData){
      viewUser = user.userId;
    }//end of for
    console.log("userid for view : ",viewUser);
        
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteViewUser,viewUser]);   
  }//end of view user method
  

}//end of class
