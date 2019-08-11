import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ROUTE_PATHS, ROUTER_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { UserModel } from "../../../../shared/models/user-model";
import { AppSettingsModel } from "../../../../shared/models/app-settings-model";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdOTPVerificationModalComponent } from './otp-verification-modal/otp-verification-modal.component';
import { ForgotPasswordService } from "../../../services/forgot-password.service";
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ispl-otp-verification',
  templateUrl: 'otp-verification.component.html',
  styleUrls: ['otp-verification.component.css']
})
export class OTPVerificationComponent implements OnInit {

  public otpVerificationFormGroup: FormGroup;
  public userId: string;//to store route param
  public userType: string = '';//to store userType from route
  public msgObj:any={
    // msg :'',
    // msgType:''
  };

  //busySpinner 
  public busy: boolean = false;

  private interval;
  public timeLeft: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private forgotPasswordService: ForgotPasswordService,
    private localStorageService: LocalStorageService) {
      this.initform();
  }

  ngOnInit(): void {
    this.getRouteParam();
    // this.setTimer();
  }

  /**
  * @description init form data
  */
 initform() {
  this.otpVerificationFormGroup = new FormGroup({
    userName: new FormControl(''),
    otp: new FormControl('', Validators.required)
  });
}//end of method


  //method to get route param
  private getRouteParam(){
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.userId = params.userId ? params.userId : '';
      this.userType = params.userType ? params.userType : '';
    });
    console.log("userId for otp verification: ", this.userId);
    if(this.userId){
      this.msgObj.msg = "An otp has been sent to your registered email id. Please check and submit it ."
      this.msgObj.msgType = 'Info';
    }
  }

  // private setTimer(){
  //   this.interval = setInterval(() =>{
  //     if(this.timeLeft>0){
  //       this.timeLeft --;
  //     }
  //   } ,  1000);
  // }

  public resendOtp(){
    let user: any = {};
    user.userId = this.userId;
    user.type = "RESOTP";
    this.busy = true;
    this.forgotPasswordService.userVerificationForForgotPassword(user, this.userType.toLocaleUpperCase()).
      subscribe(res => {
        console.log("User Verification Response: ", res);

        if(res.msgType === "Info"){
          this.msgObj.msg = "An otp has been sent to your registered email id. Please check and submit it .";
          this.msgObj.msgType = 'Info';
          // this.setTimer();//start the timer again
        }else{
          this.msgObj.msgType = 'Error';
          this.msgObj.msg = res.msg;
        }
        this.busy = false;

      },
    err => {
      console.log(err);
      this.busy = false;
    });
  }

  public onSubmitOTP(){
    this.busy = true;
    let user: any = {};
    user.userId = this.userId;
    user.otp = this.otpVerificationFormGroup.value.otp;
    user.type = "USERIDOTP"; 
    console.log(" user==>>>",user);
    this.forgotPasswordService.userVerificationForForgotPassword(user, this.userType.toUpperCase()).
      subscribe(res => {
        console.log("User Verification Response: ", res);
        if(res.msgType === "Info"){
          this.msgObj.msgType = 'Info';
          this.msgObj.msg = "";
          // alert('Info! ');
          this.busy = false;
          this.router.navigate([ROUTER_PATHS.LanderRouter]);
          const modalRef = this.modalService.open(NgbdOTPVerificationModalComponent);
        }else{
          this.msgObj.msgType = 'Error';
          this.msgObj.msg = res.msg;
          this.busy = false;
        }

      },
    err => {
      console.log(err);
      this.busy = false;
    });
  }

  public onCancel(){
    this.router.navigate([ROUTE_PATHS.RouteOTPGenerator,this.userType,this.userId]);
  }



}//end of class
