import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastService } from "../../../home/services/toast-service";
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { AddRoleDataService } from "../../services/add-role-data.service";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { UserModel } from "../../../shared/models/user-model";
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Observable } from 'rxjs/Observable';
import { NgbdModalComponent } from '../../../widget/modal/components/modal-component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-role-add',
  templateUrl: 'role-add.component.html',
  styleUrls: ['role-add.component.css']
})
export class AddRoleComponent implements OnInit {

  public title: string = '';
  public roleAddFormGroup: FormGroup;
  public menuList: any = [];
  public roleId: string = "";
  public roleName: string = "";
  //busySpinner 
  public busySpinner: any = {
    roleNameBusy: true,
    submitBusy: false,//for submit spinner
    busy: true
  }
  //for error msg
  public errMsgShowFlag: boolean = false;//to show the error msg div
  public errorMsg: string;//to store the error msg

  //to store the maxlength for localstorage
  // public roleNameLength: number = this.localStorageService.dbSettings.roleName;

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private addRoleDataService: AddRoleDataService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private modalService: NgbModal,//modal
    // private toastService: ToastService
  ) {

  }

  ngOnInit(): void {

    this.getRouteParam();//to get route param
    this.buildForm();//to build form
    this.setPageTitle();//set page title
    this.getAdminRoleName(this.roleId);//to get admin role name
  }//end of ngOnInit

  //start method buildForm
  private buildForm(): void {
    this.roleAddFormGroup = this.formBuilder.group({
      'roleName': [''
        , [
          Validators.required
        ]
      ]
    });
  }//end of the method buildForm

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.roleId = params.roleId ? params.roleId : '';
    });
  }//endof method

  //method to set title
  private setPageTitle() {
    if (this.roleId === '') {
      this.roleId = 'DEFAULT';
      this.title = 'Add Role';
    } else {
      this.title = 'Modify Role';
    }
  }//end of method

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.roleNameBusy || this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.roleNameBusy == false && this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //start method getAdminRoleName
  private getAdminRoleName(roleIdParam: string) {
    this.addRoleDataService.getAdminRoleName(roleIdParam).
      subscribe(res => {
        this.busySpinner.roleNameBusy = false;
        this.updateBusySpinner();
        console.log("get role menu", res);
        if(res.msgType === 'Info'){
          this.roleName = res.roleName;
          this.roleAddFormGroup.controls["roleName"].setValue(this.roleName);
          this.menuList = res.menuDetails;
        }else{
           // show error msg on html page
           this.errMsgShowFlag = true;
           this.errorMsg = "Unable to load data!";
        }
      },
        err => {
          this.busySpinner.roleNameBusy = false;
          this.updateBusySpinner();
          console.log(err);
           // show error msg on html page
           this.errMsgShowFlag = true;
           this.errorMsg = "Unable to load data!";
           this.sessionErrorService.routeToLander(err._body);
        });
  }//end of the method getAdminRoleName



  // start method mainMenuCheck
  public mainMenuCheck(applnIdParam?: string) {
    let mainMenuChecked: boolean;
    for (let mList of this.menuList) {
      if (mList.applnId == applnIdParam) {
        if (mList.selected == false) {
          mList.selected = true;
        } else if (mList.selected == true) {
          mList.selected = false;
        }//end of else
        mainMenuChecked = mList.selected;
        for (let subList of mList.subMenuDetails) {
          subList.selected = mainMenuChecked;
          for (let nestedSubList of subList.subMenuDetails) {
            nestedSubList.selected = mainMenuChecked;
          }//end of for
        }//end of for
      }//end of if
    }// end of outer for
  }//end of the method main menu check

  //start method subMenuCheck
  public subMenuCheck(subApplnId: string) {
    let subMenuChecked: boolean;
    for (let mList of this.menuList) {
      for (let subList of mList.subMenuDetails) {
        if (subApplnId == subList.subId) {
          if (subList.selected == false) {
            subList.selected = true;
          } else if (subList.selected == true) {
            subList.selected = false;
          }//end of else if
          subMenuChecked = subList.selected;
          for (let nestedSubList of subList.subMenuDetails) {
            nestedSubList.selected = subMenuChecked;
          }//end of for
        }//end of if
      }//end of for
    }//end of for
  }//end of the method subMenuCheck

  //method to check nested submenu
  nestedSubMenuCheck(nestedSubId: string) {
    for (let mList of this.menuList) {
      for (let subList of mList.subMenuDetails) {
        for (let nestedSubList of subList.subMenuDetails) {
          if (nestedSubId == nestedSubList.subId) {
            if (nestedSubList.selected == true) {
              nestedSubList.selected = false;
            } else if (nestedSubList.selected == false) {
              nestedSubList.selected = true;
            }//end of else if
          }//end of if
        }//end of for
      }//end of if
    }//end of for
  }//end of method

  //method to submit role
  public addRoleSubmit() {
    let role: any = {};
    if (this.roleId == 'DEFAULT') {
      this.roleId = "";
    }
    role.roleId = this.roleId;
    role.roleName = this.roleAddFormGroup.value.roleName;
    console.log(" menulist ", this.menuList);
    let applnId: string;
    let subId: string;
    let menuListParam: string[] = [];
    for (let mList of this.menuList) {
      applnId = "";
      if (mList.selected == true) {
        applnId = mList.applnId;
        for (let subList of mList.subMenuDetails) {
          subId = "";
          if (subList.selected == true) {
            subId = subList.subId;
            for (let nestedSubList of subList.subMenuDetails) {
              if (nestedSubList.selected == true) {
                menuListParam.push(nestedSubList.subId);
              }//end of if
            }//end of for
            menuListParam.push(subId)
          }//end of if
        }//end of for
        menuListParam.push(applnId);
      }//end of if
    }//end of for
    role.attributes = menuListParam;
    console.log(" role json ", role);
    let methodForAddOrEditRoleName: any;
    methodForAddOrEditRoleName = this.roleId ?
      this.addRoleDataService.modifyRoleName(role) :
      this.addRoleDataService.submitRoleName(role);
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();
    methodForAddOrEditRoleName.
      subscribe(res => {
        console.log("add role Success Response: ", res);
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
        if (res.msgType == "Info") {
          this.onOpenModal(role.roleId, role.roleName);
          this.router.navigate([ROUTE_PATHS.RouteHome]);
        } else {
          // show error msg on html page
          this.errMsgShowFlag = true;
          this.errorMsg = res.msg;
          // "Unable to load data!";
        }
      },
      err => {
        console.log(err);
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
        if (err.status == 401) {
          // show error msg on html page
          this.errMsgShowFlag = true;
          this.errorMsg = "Netowrk/Server Problem";
        } else {
           // show error msg on html page
           this.errMsgShowFlag = true;
           this.errorMsg = this.roleId ? "Unable to update data." : "Unable to save data.";
          //  "Netowrk/Server Problem";
          //this.resErrorMsg = "Netowrk/Server Problem";
        }
        this.sessionErrorService.routeToLander(err._body);
      });
  }//end of method

 // start method of deleteResErrorMsgOnClick
 public deleteResErrorMsgOnClick(resMsgType) {
  this.errMsgShowFlag = false;//to hide the error msg div
}//method to delete error msg

  //onOpenModal for opening modal from modalService
  private onOpenModal(roleId: string, roleName: string) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Information';
    modalRef.componentInstance.modalMessage =
      roleId ?
        "Role Name " + roleName + " updated successfully."
        : "Role Name " + roleName + " created successfully.";
  }
  //end of method onOpenModal

  //on cancel button click
  onCancel(): void {
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }//end of method
}//end of class
