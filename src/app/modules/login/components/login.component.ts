import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginModel } from '../models/login-model';
import { UserValidators } from '../models/user-validator';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS, ROUTER_PATHS } from '../../router/router-paths';
import { LoginService } from '../services/login.service';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { UserModel } from "../../shared/models/user-model";
import { AppSettingsModel } from "../../shared/models/app-settings-model";
import { DBSettingsModel } from "../../shared/models/db-Settings-model";

@Component({
  selector: 'ispl-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  public title: string = "Vendor Portal";
  public loginForm: FormGroup;
  public loginError: string = '';
  public msgType: string = "";
  public userType: string = "";
  public busySpinner:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private loginService: LoginService,
    private localStorageService: LocalStorageService
    ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getRouteParam();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      'username': [''
        , [
          Validators.required,
        ]
      ],
      'password': [''
        , [
          Validators.required,
        ]
      ]
    });

  }

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.userType = params.userType ? params.userType : '';
    });
    console.log(" userType::::::::::",this.userType);
    this.localStorageService.userType = this.userType;
    if(this.userType == 'vendor'){
      this.disclaimerToggle();
    }

  }//end of method to get route param


  public loginSubmit(): void {
    console.log("login click");
    this.busySpinner = true;//to load spinner
    let user: any = {};

    user.userId = this.loginForm.value.username;
    user.password = this.loginForm.value.password;
    this.loginService.authenticate(user, this.userType.toUpperCase()).
        subscribe(res => {
          console.log("Login Success Response: ",res);
          this.msgType = res.msgType;          
          this.busySpinner = false;
          if(res.msgType === "Info"){ 
            this.setLoginDetailsToLocalstorageService(res);//calling the method to set login response to localstorage  
            if(this.localStorageService.user.isNew === "N"){
              this.router.navigate([ROUTE_PATHS.RouteHome]);        
            }else{
              this.router.navigate([ROUTE_PATHS.RouteManageProfile]);        
            }    
          }else if(res.msgType === "InfoOther"){
            this.loginError = res.msg;
            this.loginForm.controls["username"].setValue('');
            this.loginForm.controls["password"].setValue('');
          }else{
            this.loginError = res.msg;
            // "Netowrk/Server Problem";
          }
        },
        err => {
          this.busySpinner = false;//stop spinner
          if (err.status == 401) {
            this.loginError = "Invalid User Credentials";
          } else {
            this.loginError = "Netowrk/Server Problem";
          }
        });       
  }//end of method login service

  //new add to add login details in localstorage services
  public setLoginDetailsToLocalstorageService(resDetails: any){
    console.log("in setLoginDetailsToLocalstorageService method...");
    let userModel: UserModel  = new UserModel();
    userModel.accessToken = resDetails.accessToken;
    userModel.userId = resDetails.userDetails.userId;  
    userModel.userType = resDetails.userDetails.userType; 
    userModel.code = resDetails.userDetails.code; 
    userModel.name = resDetails.userDetails.name;  
    userModel.vendorGstin = resDetails.userDetails.vendorGstin;
    userModel.vendorPanNo = resDetails.userDetails.vendorPanNo;  
    userModel.active = resDetails.userDetails.active;
    userModel.isNew = resDetails.userDetails.isNew;
    userModel.codeDetails = resDetails.userDetails.codeDetails;                 
    this.localStorageService.user = userModel;

    //set appsettings details from login response to localstorage
    let appSettingsModel: AppSettingsModel = new AppSettingsModel();    
    appSettingsModel.menuDetails = resDetails.userDetails.menuDetails;//set menu details
    appSettingsModel.companyGstin = resDetails.appSettingsDetails.companyGstin;//to get the companyGstin
    appSettingsModel.useForValue1 = resDetails.appSettingsDetails.useForValue1;//to get the useForValue1
    appSettingsModel.useForValue2 = resDetails.appSettingsDetails.useForValue2;//to get the useForValue2
    appSettingsModel.useFor = resDetails.appSettingsDetails.useFor;//to store useFor array
    appSettingsModel.dbFields = resDetails.appSettingsDetails.dbFields;//to store db field name 
    this.localStorageService.appSettings = appSettingsModel;
    
    //set the dbsettings details to dbsettings model
    let dbSettingsModel: DBSettingsModel = new DBSettingsModel();
    dbSettingsModel.drcrnoteNumber = resDetails.dbSettingsDetails.drcrnoteNumber;
    dbSettingsModel.invoiceNumber = resDetails.dbSettingsDetails.invoiceNumber;
    dbSettingsModel.itemDesc = resDetails.dbSettingsDetails.itemDesc;
    dbSettingsModel.itemReason = resDetails.dbSettingsDetails.itemReason;
    this.localStorageService.dbSettings = dbSettingsModel;
  }//end of method to set login response to localstorage 

  //method for forgot password route
  public onClickLinkRoute(callingFrom:string){
    if(callingFrom === 'F'){
      this.router.navigate([ROUTE_PATHS.RouteForgotPassword,this.userType]);
    }else if(callingFrom === 'D'){
      this.disclaimerToggle();
    }else if(callingFrom === 'S'){
      this.router.navigate([ROUTE_PATHS.RouteSignUp]);
    }
  }//end of the method forgotpassword

  // modal
  disclaimerFlag: boolean = false;
  private disclaimerToggle(){
    this.disclaimerFlag = this.disclaimerFlag ? false: true;
  }
  public modalCrossClick(){
    this.disclaimerToggle();
  }



}//end of class
