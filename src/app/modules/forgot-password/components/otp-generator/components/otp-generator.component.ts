import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { ForgotPasswordService } from "../../../services/forgot-password.service";
@Component({
  selector: 'ispl-otp-generator',
  templateUrl: 'otp-generator.component.html',
  styleUrls: ['otp-generator.component.css']
})
export class OTPGeneratorComponent implements OnInit {

  public otpGeneratorFormGroup: FormGroup;
  public userId: string = '';//to store the value of userId
  public userType: string = '';//to store userType from route
  public errorValue: string = '';

  //busySpinner 
  public busySpinner: boolean = false;

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
    this.otpGeneratorFormGroup = new FormGroup({
      otpGeneratorOption: new FormControl('', Validators.required)
    });
  }//end of method


  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.userId = params.userId ? params.userId : '';
      this.userType = params.userType ? params.userType : '';
    });
    console.log("userId for otp verification: ", this.userId);
  }


  public onSubmitOTP() {
    let otpGeneratorOption: string = this.otpGeneratorFormGroup.value.otpGeneratorOption;
    if (otpGeneratorOption == 'generateOtp') {
      this.busySpinner = true;
      let user: any = {};
      user.userId = this.userId;
      user.type = "USERID"; //USERIDOTP
      this.forgotPasswordService.userVerificationForForgotPassword(user,this.userType.toLocaleUpperCase()).
        subscribe(res => {
          console.log("User Verification Response: ", res);
          if (res.msgType === "Info") {
            this.errorValue = "";
            this.router.navigate([ROUTE_PATHS.RouteOTPVerification, this.userType, this.userId]);
            this.busySpinner = false;
          } else {
            this.errorValue = res.msg;
            this.busySpinner = false;
          }
        },
          err => {
            console.log(err);
          });
    } else if (otpGeneratorOption == 'haveOtp') {
      this.router.navigate([ROUTE_PATHS.RouteOTPVerification, this.userType, this.userId]);
    }
  }


  public onCancel() {
    this.busySpinner = true;
    this.router.navigate([ROUTE_PATHS.RouteLander]);
  }

}//end of class
