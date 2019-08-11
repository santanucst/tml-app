import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';
import { SignUpService } from "../services/sign-up.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../../widget/modal/components/modal-component';
@Component({
  selector: 'ispl-sign-up',
  templateUrl: 'sign-up.component.html',
  styleUrls: ['sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public title: string = "Vendor Portal";
  public signUpFormGroup: FormGroup;
  public signUpError: string = '';
  public msgType: string = "";
  public userType: string = "";
  public busySpinner: boolean = false;
  public randomNo: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private signUpService: SignUpService
    ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getRandom(12345,23456);
  }

  private buildForm(): void {
    this.signUpFormGroup = this.formBuilder.group({
      'username': [''
        , [
          Validators.required,
        ]
      ],
      'captcha': [''],
      'validcaptcha': [''
      , [
        Validators.required,
      ]
    ],
    });

  }

  public getRandom(floor: number, ceiling: number) {
    this.randomNo = Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
  }

  
  public vendorSignUpSubmit(): void {
    let userId: string = this.signUpFormGroup.value.username;
    let user: any = {};
    user.userId = userId;
    let userType: string = 'VENDOR';
    this.busySpinner = true;
    let randomNoInput: number = this.signUpFormGroup.value.validcaptcha;
    if(randomNoInput == this.randomNo){
      this.signUpError = '';
      console.log(" captched matched ");
      this.signUpService.vendorSignUp(user, userType).
    subscribe(res => {
      console.log("Login Success Response: ",res);
      this.msgType = res.msgType;          
      this.busySpinner = false;
      if(res.msgType === "InfoOther"){
        this.onOpenModal(res.msg);
        this.router.navigate([ROUTE_PATHS.RouteLander]);
      }else{
        this.signUpError = res.msg;
      }
    },
    err => {
      this.busySpinner = false;//stop spinner
      if (err.status == 401) {
        this.signUpError = "Invalid User Credentials";
      } else {
        this.signUpError = "Netowrk/Server Problem";
      }
    });       
    }else{
      this.busySpinner = false;
      this.signUpError = 'Captcha doesn′t match';
    }
    
  }//end of method login service

  //onOpenModal for opening modal from modalService
  private onOpenModal(signUpMsg: string) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Information';
    modalRef.componentInstance.modalMessage = signUpMsg;
  }

}//end of class
