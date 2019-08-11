import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastService } from "../../home/services/toast-service";
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { ManageProfileService } from '../services/manage-profile.service';
import { NgbdModalComponent } from '../../widget/modal/components/modal-component';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-manage-profile-form',
  templateUrl: 'manage-profile.component.html',
  styleUrls: ['manage-profile.component.css']
})
export class ManageProfileComponent implements OnInit {

  public title: string = "Manage Profile";
  public manageProfileFormGroup: FormGroup;
  public manageProfileUserError: string = '';//for error

  public securityQues: any = [];//to store all sec ques 
  public selectedValUser: any = [];//for selected user details
  //these variables are used for html view purpose
  public selectedUserId: string;
  public password : string;
  public secAns : string;
  public selectedQues : string;
  public selectedQuesId : string;
  public userType : string;

  //for busy spinner
  public busySpinner: any = {
    secQuesdropdownBusy: true,
    validUserBusy: true,
    submitBusy: false,//for submit spinner
    busy: true
  };



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    // private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal,//modal
    private manageProfileService: ManageProfileService
  ) {

  }

  ngOnInit(): void {
    this.userType = this.localStorageService.user.userType;
    this.getSelectValUser();//to get user details
    this.getSecurityQues();//to get security question details
    this.buildForm(); 
  }
  //to get security question details
  private getSecurityQues() {
    this.manageProfileService.getSelectValSecurityQuestion().
      subscribe(res => {
        console.log("getSelectValSecurityQuestion: ", res);
        this.securityQues = res.details;
        this.busySpinner.secQuesdropdownBusy = false;
        this.updateBusySpinner();
      },
      err => {
        console.log(err);
        this.busySpinner.secQuesdropdownBusy = false;
        this.updateBusySpinner();
      });
  }//end of method getSecurityQues

  //method to get selected values for manage profile
  private getSelectValUser() {
    this.manageProfileService.getSelectValUser().
      subscribe(res => {
        console.log("getSelectValUser: ", res);
        this.selectedValUser = res.details[0];
        this.busySpinner.validUserBusy = false;
        this.updateBusySpinner();
        console.log("selectedValUser :",this.selectedValUser);
         this.selectedUserId = this.selectedValUser.userId;
         this.manageProfileFormGroup.controls["userId"].setValue(this.selectedUserId);
         this.password = this.selectedValUser.passwd;
         this.secAns = this.selectedValUser.secAns;
         this.selectedQuesId = this.selectedValUser.secQuesId;
         this.manageProfileFormGroup.controls["secQuesId"].setValue(this.selectedQuesId);
         console.log("user Id ",this.selectedUserId);
         console.log("selected qstn id : ",this.selectedQuesId);
      },
      err => {
        console.log(err);
        this.busySpinner.validUserBusy = false;
        this.updateBusySpinner();
      });

  }//end of getSelectValUser method

//onOpenModal for opening modal from modalService
  private onOpenModal(manageProfileUserId, msgType, msg) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    if(msgType === 'Info'){
      modalRef.componentInstance.modalTitle = 'Information';
    }else{
      modalRef.componentInstance.modalTitle = msgType;
    }
    if(msgType === 'Info'){
      modalRef.componentInstance.modalMessage = "User Id "+ manageProfileUserId + " updated successfully."
    }else{
      modalRef.componentInstance.modalMessage = msg;
    }
  }
  //end of method onOpenModal

  private buildForm(): void {
    this.manageProfileFormGroup = this.formBuilder.group({
      'userId': [''
      ],
      'passwd': [''
        , [
          Validators.required,
        ]
      ],
      'secQuesId': [''
         , [
          Validators.required,
        ]
      ],
      'secAns': [''
        , [
          Validators.required,
        ]
      ]
    });
  }

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.secQuesdropdownBusy || this.busySpinner.validUserBusy || this.busySpinner.submitBusy ) {
      this.busySpinner.busy = true;
    } else if(this.busySpinner.secQuesdropdownBusy == false  && this.busySpinner.validUserBusy == false &&  this.busySpinner.submitBusy== false){
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //method to submit user manage profile data
  public userManageProfileSubmit(): void {
    console.log("form value of manage profile: ",this.manageProfileFormGroup.value);
    let user: any = {};
    user.userId = this.manageProfileFormGroup.value.userId;
    user.passwd = this.manageProfileFormGroup.value.passwd;
    user.secQuesId = this.manageProfileFormGroup.value.secQuesId;
    user.secAns = this.manageProfileFormGroup.value.secAns;
    console.log("UserDetails for manage profile: ", user);

    console.log("selected user id submit : ",this.manageProfileFormGroup.value.userId);
    console.log("selected seq id submit : ",this.manageProfileFormGroup.value.secQuesId);
    
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();
    this.manageProfileService.manageProfileUserDetails(user).
    subscribe(res => {
        console.log("User manage profile Success Response: ",res);
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
        let manageProfileUserId = res.value;
        //calling the onOpenModal method to open the modal and passing the user id to it
        this.onOpenModal(manageProfileUserId, res.msgType, res.msg);

        if(res.msgType == 'Info'){

          if(this.localStorageService.user.isNew === "N"){
            this.router.navigate([ROUTE_PATHS.RouteHome]);
          }else{
            this.router.navigate([ROUTE_PATHS.RouteLogout]);
          }
        }
      },
      err => {
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
        if (err.status == 401) {
          this.manageProfileUserError = "Invalid User Credentials";
        } else {
          this.manageProfileUserError = "Netowrk/Server Problem";
        }
      });
  }//end of method userManageProfileSubmit

//on click cancel
  public onCancel(): void {
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }

}