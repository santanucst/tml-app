import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { UserModel } from "../../../shared/models/user-model";
import { AppSettingsModel } from "../../../shared/models/app-settings-model";
import { ForgotPasswordService } from "../../services/forgot-password.service";
import { Subscription } from 'rxjs/Subscription';//to get route param
@Component({
  selector: 'ispl-user-verification',
  templateUrl: 'user-verification.component.html',
  styleUrls: ['user-verification.component.css']
})
export class UserVerificationComponent implements OnInit {

  public userVerificationFormGroup: FormGroup;
  public userId: string = '';//to store the value of userId
  public userType: string = '';//to get route param
  public errorValue: string = '';

  //busySpinner 
  public busySpinner:boolean = false;  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private forgotPasswordService: ForgotPasswordService
  ) {
    this.initform();
  }

  ngOnInit(): void {
    this.getRouteParam();
  }

  /**
  * @description init form data
  */
 initform() {
  this.userVerificationFormGroup = new FormGroup({
    userName: new FormControl('', Validators.required)
  });
}//end of method

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.userType = params.userType ? params.userType : '';
    });
    console.log("userType : ", this.userType);
  }

  public onSubmitUsername(){
    this.busySpinner = true;
    let user: any = {};
    user.userId = this.userVerificationFormGroup.value.userName;
    this.userId = this.userVerificationFormGroup.value.userName;
    user.type = "USERID"; //USERIDOTP
    this.forgotPasswordService.userVerificationForForgotPassword(user, this.userType.toLocaleUpperCase()).
      subscribe(res => {
        console.log("User Verification Response: ", res);
        if(res.msgType === "Info"){
          this.errorValue = "";
          this.router.navigate([ROUTE_PATHS.RouteOTPGenerator,this.userType,this.userId]);
          this.busySpinner = false;
        }else{
          this.errorValue = res.msg;
          this.busySpinner = false;
        }
      },
    err => {
      console.log(err);
    });    
  }

  public onCancel(){
    this.busySpinner = true;
    this.router.navigate([ROUTE_PATHS.RouteLander]);
  }

}//end of class
