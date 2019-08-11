import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { Http, RequestOptions, Headers, Response } from '@angular/http';
// import "rxjs/add/operator/do";
// import "rxjs/add/operator/map";
// import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { SapDetEmitService } from "../../services/sap-details-emit.service";


@Component({
  selector: 'sap-detail-modal.component',
  templateUrl: 'sap-detail-modal.component.html',
  styleUrls: ['sap-detail-modal.component.css']
})
export class NgbdSapDetailModalComponent {
  @Input() modalTitle: string = "Sap Details";
  @Input() selectedUseForArr: string[];//for selected usefor array
  // @Input() detailSettingsMaxLengthArr: string[];//for maxlength
  
  private localStorageUseForArr: string[] = [];
  public useForArr: string[] = [];
  public sapDetailsObj: any = {};//to store the sap details array
  //for error msg
  public errMsgShowFlag: boolean = false;//to show the error msg div
  public errorMsg: string;//to store the error msg

  constructor(public activeModal: NgbActiveModal,
    // private http: Http, 
    private el: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private sapDetailsEmitService: SapDetEmitService

  ) {
  }

  ngOnInit(): void {
    console.log(" selectedUseForArr in NgbdSapDetailModalComponent::: ", this.selectedUseForArr);
    this.localStorageUseForArr = this.localStorageService.appSettings.useFor;
    // this.useForArr = this.localStorageUseForArr;
    console.log("localstorage useFor array::", this.localStorageUseForArr);
    this.setUseForArr();//calling the method to remove some duplicate element of useForArray
  }//end of onInit

  // // method to remove selecteduseFor array
  // private setUseForArr(){
  //   if(this.selectedUseForArr.length > 0){
  //     for(let selectedUseFor of this.selectedUseForArr) {
  //       this.nestedRemoveUseForArr(selectedUseFor);//calling the method to remove selected usefor arr element
  //     }//end of for
  //   }//end of if
  //   console.log(" selectedUseForArr in NgbdSapDetailModalComponent::: ", this.selectedUseForArr);
  //   console.log("useFor array after removing some duplicate values::", this.useForArr);
  //   console.log("localstorage usefor arr::::",this.localStorageService.appSettings.useFor);
  // }//end of method
  
  // //nested for loop method to remove selectedUseForArr element
  // private nestedRemoveUseForArr(selectedUseFor: string) {
  //   let indexCount: number = 0;
  //   for(let useForEl of this.useForArr){
  //     if(useForEl === selectedUseFor){
  //       this.useForArr.splice(indexCount,1);
  //       break;
  //     }
  //   }//end of for
  //   indexCount ++;
  // }//end of method

  // method to remove selecteduseFor array
  private setUseForArr(){
    if(this.selectedUseForArr.length > 0){
      for(let selectedUseFor of this.selectedUseForArr) {
        this.nestedSetUseForArr(selectedUseFor);//calling the method to remove selected usefor arr element
      }//end of for
    }else{
      for(let localUseForEl of this.localStorageUseForArr){
        this.useForArr.push(localUseForEl);
      }//end of for
    }//end of else
    console.log(" selectedUseForArr in NgbdSapDetailModalComponent::: ", this.selectedUseForArr);
    console.log("useFor array after::", this.useForArr);
    console.log("localstorage usefor arr::::",this.localStorageService.appSettings.useFor);
  }//end of method

  //nested for loop method to remove selectedUseForArr element
  private nestedSetUseForArr(selectedUseFor: string) {
    let indexCount: number = 0;
    for(let useForEl of this.localStorageUseForArr){
      if(useForEl != selectedUseFor){
        this.useForArr.push(useForEl);
        // break;
      }
    }//end of for
    indexCount ++;
  }//end of method


  //start method chooseItem to pass the item details through evnt emitter
  public sapDetailsModalSubmit(useFor: string, sapCompanyCode: string, sapDescription: string, sapApplicationServer: string, sapSystemNo: string, sapSystemId: string, sapLanguage: string, sapRouter: string, sapClient: string, sapUser: string, sapUserPassword: string, physicalPath: string) {
    if(useFor && sapCompanyCode && sapDescription && sapApplicationServer && sapSystemNo && sapSystemId && sapLanguage && sapRouter && sapClient && sapUser && sapUserPassword && physicalPath) {
      let sapObj: any = {};
      sapObj.useFor = useFor;
      sapObj.sapCompanyCode = sapCompanyCode;
      sapObj.sapDescription = sapDescription;
      sapObj.sapApplicationServer = sapApplicationServer;
      sapObj.sapSystemNo = sapSystemNo;
      sapObj.sapSystemId = sapSystemId;
      sapObj.sapLanguage = sapLanguage;
      sapObj.sapRouter = sapRouter;
      sapObj.sapClient = sapClient;
      sapObj.sapUser = sapUser;
      sapObj.sapUserPassword = sapUserPassword;
      sapObj.physicalPath = physicalPath;
  
      this.sapDetailsObj = sapObj;
      console.log(" selected sapDetailsObj ===>", this.sapDetailsObj);
      //passing items details grid row through eventemitter
      this.sapDetailsEmitService.emitModalResult(this.sapDetailsObj);
      this.onClickOk();
    }else if(useFor === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Choose Use For!";
    }else if(sapCompanyCode === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Company Code!";
    }else if(sapDescription === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Description!";
    }else if(sapApplicationServer === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Application Server!";
    }else if(sapSystemNo === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter System Number!";
    }else if(sapSystemId === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter System Id!";
    }else if(sapLanguage === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Language!";
    }else if(sapRouter === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Router!";
    }else if(sapClient === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Client!";
    }else if(sapUser === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter User Id!";
    }else if(sapUserPassword === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Password!";
    }else if(physicalPath === '') {
      this.errMsgShowFlag = true;
      this.errorMsg = "Please Enter Physical Path!";
    }
   
  }//end of the method of chooseItem

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    this.errMsgShowFlag = false;//to hide the error msg div
  }//method to delete error msg

  public onClickOk() {
    this.activeModal.dismiss('Close click');
  }




}//end of class