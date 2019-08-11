import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSapDetailModalComponent } from './sap-detail-modal/sap-detail-modal.component';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { NgbdModalComponent } from '../../widget/modal/components/modal-component';
import { ROUTE_PATHS } from '../../router/router-paths';
import { PortalSettingsDataService } from "../services/portal-settings.services";
import { SapDetEmitService } from "../services/sap-details-emit.service";
import { SessionErrorService } from "../../shared/services/session-error.service";
@Component({
  selector: 'portal-settings',
  templateUrl: 'portal-settings.component.html',
  styleUrls: ['portal-settings.component.css']
})

export class PortalSettingsComponent implements OnInit {
  
  private slNo: number = 0;//to store slno from sap grid
  private selectedUseForArr: string[] = [];//to set sap UseFor array
  // public portalSettingsFormGroup: FormGroup;
  public companyDetailsFormGroup: FormGroup;//for company
  public emailDetailsFormGroup: FormGroup;//for email
  public ftpServerDetailsFormGroup: FormGroup;//for ftp server
  public imageProcessingDetailsFormGroup: FormGroup;//for image processing
  public applicationDetailsFormGroup: FormGroup;//for image processing
  public title: string = "Modify Portal Settings"
  //var to store response details
  public companyDetail: any = {};//to store company det
  public sapDetailsArr: any[] = [];//to store the sap details array
  public detailSettings: any = {};//to store details setting
  public headerSettings: any = {};//to store header setting
  public enableSslValue: boolean;//enable radio value
  public bccRequiredValue: string;//bcc radio value
  public sentEmailValue: string;//sentEmail radio value
  public changeFinancialYearValue: string;//to store changeFinancialYear radio value
  //to show hide the tab details
  public tabHideShow: any = {
    companyDetTab: true,
    emailDetTab: false,
    ftpServerTab: false,
    imageProcessingTab: false,
    sapTab: false
  }

  //for busy spinner
  public busySpinner: any = {
    busy: true
  };

  //for error msg
  public errMsgShowFlag: boolean = false;//to show the error msg div
  public errorMsg: string;//to store the error msg
 //editSAPItemFormGroup 
 public editSAPItemFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private portalSettingsDataService: PortalSettingsDataService,
    private sapDetailsEmitService: SapDetEmitService,
    private sessionErrorService: SessionErrorService,
    private router: Router
  ) {
    let editSapItemGroup: any = {};
    editSapItemGroup['useFor'] = new FormControl();
    editSapItemGroup['sapCompanyCode'] = new FormControl();
    editSapItemGroup['sapDescription'] = new FormControl();
    editSapItemGroup['sapApplicationServer'] = new FormControl();
    editSapItemGroup['sapSystemNo'] = new FormControl();
    editSapItemGroup['sapSystemId'] = new FormControl();
    editSapItemGroup['sapLanguage'] = new FormControl();
    editSapItemGroup['sapRouter'] = new FormControl();
    editSapItemGroup['sapClient'] = new FormControl();
    editSapItemGroup['sapUser'] = new FormControl();
    editSapItemGroup['sapUserPassword'] = new FormControl();
    editSapItemGroup['sapPhysicalPath'] = new FormControl();
    this.editSAPItemFormGroup = new FormGroup(editSapItemGroup);
  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of portal-settings class..");
    this.buildForm();//to build form
    this.companyDetailsWS();//get company details
    this.getModalResultEventEmitter();//to get modal result from sap details modal
  }//end of oninit

  //start method buildForm
  private buildForm(): void {
    this.companyDetailsFormGroup = this.formBuilder.group({
      'companyId': [''
        , [
          Validators.required
        ]
      ], 'companyName': [''
        , [
          Validators.required
        ]
      ], 'address1': [''
        , [
          Validators.required
        ]
      ], 'address2': [''
        // , [
        //     Validators.required
        //   ]
      ], 'pin': [''
        , [
          Validators.required
        ]
      ], 'phoneStdCode': [''
        , [
          Validators.required
        ]
      ], 'phoneNo': [''
        , [
          Validators.required
        ]
      ], 'website': [''
        , [
          Validators.required
        ]
      ], 'gstin': [''
        , [
          Validators.required
        ]
      ], 'authenticationExpireInSecond': [''
        , [
          Validators.required
        ]
      ]
    });//end of company details 

    this.emailDetailsFormGroup = this.formBuilder.group({
      'emailId': [''
        , [
          Validators.required
        ]
      ], 'pass': [''
        , [
          Validators.required
        ]
      ], 'port': [''
        , [
          Validators.required
        ]
      ], 'enableSsl': [''
        , [
          Validators.required
        ]
      ], 'bccRequired': [''
        , [
          Validators.required
        ]
      ], 'host': [''
        , [
          Validators.required
        ]
      ], 'sendMailTimeoutLimit': [''
        , [
          Validators.required
        ]
      ], 'sentEmail': [''
        , [
          Validators.required
        ]
      ]
    });//end of email formgroup

    this.ftpServerDetailsFormGroup = this.formBuilder.group({
      'ftpProtocol': [''
      , [
        Validators.required
      ]
      ], 'ftpServer': [''
        , [
          Validators.required
        ]
      ], 'ftpServerPublic': [''
        , [
          Validators.required
        ]
      ], 'ftpServerPort': [''
        , [
          Validators.required
        ]
      ], 'ftpServerUser': [''
        , [
          Validators.required
        ]
      ], 'ftpServerUserPassword': ['',
        [
          Validators.required
        ]
      ]
    });//end of ftp server det formgroup

    this.imageProcessingDetailsFormGroup = this.formBuilder.group({
      'imageOkPercentage': [''
        , [
          Validators.required
        ]
      ], 'changeFinancialYear': [''
        , [
          Validators.required
        ]
      ], 'financialYear': [''
        , [
          Validators.required
        ]
      ]
    });//end of imageProcessingDetailsFormGroup

    this.applicationDetailsFormGroup = this.formBuilder.group({
      'applicationDomainName': ['']
      , 'applicationServerPublicIPAddress':['']      
      , 'applicationServerLocalIPAddress':['']
      , 'applicationServerPortNo':[0]
    });//end of imageProcessingDetailsFormGroup    
  }//end of the method buildForm

  //method to get company details service call
  private companyDetailsWS() {
    this.portalSettingsDataService.getCompanyDetails().
      subscribe(res => {
        console.log("res of company details..", res);
        this.busySpinner.busy = false;
        if(res.msgType === 'Info'){
          this.companyDetail = res.companyDetail;
          this.headerSettings = res.headerSettings;
          this.detailSettings = res.detailSettings;
          //calling the method to set values in form control
          this.setValuestoFormControlName();
        }else{
          this.errMsgShowFlag = true;
          this.errorMsg = res.msg;
        }
      },
        err => {
          console.log("err of  company det..", err);
          this.errMsgShowFlag = true;
          this.errorMsg = "Unable to load data! Please try again.";
          this.busySpinner.busy = false;
          this.sessionErrorService.routeToLander(err._body);
        })
  }//end of service call method

  //method to set values in form control
  private setValuestoFormControlName() {
    this.companyDetailsFormGroup.controls["companyId"].setValue(this.companyDetail.companyId);
    this.companyDetailsFormGroup.controls["companyName"].setValue(this.companyDetail.companyName);
    this.companyDetailsFormGroup.controls["address1"].setValue(this.companyDetail.address1);
    this.companyDetailsFormGroup.controls["address2"].setValue(this.companyDetail.address2);
    this.companyDetailsFormGroup.controls["pin"].setValue(this.companyDetail.pin);
    this.companyDetailsFormGroup.controls["phoneStdCode"].setValue(this.companyDetail.phoneStdCode);
    this.companyDetailsFormGroup.controls["phoneNo"].setValue(this.companyDetail.phoneNo);
    this.companyDetailsFormGroup.controls["website"].setValue(this.companyDetail.website);
    this.companyDetailsFormGroup.controls["gstin"].setValue(this.companyDetail.gstin);
    this.companyDetailsFormGroup.controls["authenticationExpireInSecond"].setValue(this.companyDetail.authenticationExpireInSecond);

    this.emailDetailsFormGroup.controls["emailId"].setValue(this.companyDetail.emailId);
    this.emailDetailsFormGroup.controls["pass"].setValue(this.companyDetail.pass);
    this.emailDetailsFormGroup.controls["port"].setValue(this.companyDetail.port);
    this.enableSslValue = this.companyDetail.enableSsl;
    this.emailDetailsFormGroup.controls["enableSsl"].setValue(this.enableSslValue);
    this.bccRequiredValue = this.companyDetail.bccRequired;
    this.emailDetailsFormGroup.controls["bccRequired"].setValue(this.bccRequiredValue);
    this.emailDetailsFormGroup.controls["host"].setValue(this.companyDetail.host);
    this.emailDetailsFormGroup.controls["sendMailTimeoutLimit"].setValue(this.companyDetail.sendMailTimeoutLimit);
    this.sentEmailValue = this.companyDetail.sentEmail;
    this.emailDetailsFormGroup.controls["sentEmail"].setValue(this.sentEmailValue);

    this.ftpServerDetailsFormGroup.controls["ftpProtocol"].setValue(this.companyDetail.ftpProtocol);
    this.ftpServerDetailsFormGroup.controls["ftpServer"].setValue(this.companyDetail.ftpServer);
    this.ftpServerDetailsFormGroup.controls["ftpServerPublic"].setValue(this.companyDetail.ftpServerPublic);
    this.ftpServerDetailsFormGroup.controls["ftpServerPort"].setValue(this.companyDetail.ftpServerPort);
    this.ftpServerDetailsFormGroup.controls["ftpServerUser"].setValue(this.companyDetail.ftpServerUser);
    this.ftpServerDetailsFormGroup.controls["ftpServerUserPassword"].setValue(this.companyDetail.ftpServerUserPassword);

    this.imageProcessingDetailsFormGroup.controls["imageOkPercentage"].setValue(this.companyDetail.imageOkPercentage);
    this.changeFinancialYearValue = this.companyDetail.changeFinancialYear;
    this.imageProcessingDetailsFormGroup.controls["changeFinancialYear"].setValue(this.changeFinancialYearValue);
    this.imageProcessingDetailsFormGroup.controls["financialYear"].setValue(this.companyDetail.financialYear);

    this.applicationDetailsFormGroup.controls["applicationDomainName"].setValue(this.companyDetail.applicationDomainName);
    this.applicationDetailsFormGroup.controls["applicationServerPublicIPAddress"].setValue(this.companyDetail.applicationServerPublicIPAddress);
    this.applicationDetailsFormGroup.controls["applicationServerLocalIPAddress"].setValue(this.companyDetail.applicationServerLocalIPAddress);
    this.applicationDetailsFormGroup.controls["applicationServerPortNo"].setValue(this.companyDetail.applicationServerPortNo);
    

    let sapArr: string[] = this.companyDetail.details;
    if (sapArr.length > 0) {
      this.sapDetailsArr = sapArr;
    }

  }//end of method

    //onOpenModal for opening modal from modalService
    private onOpenModal(modalMessage: string) {
      const modalRef = this.modalService.open(NgbdModalComponent);
      modalRef.componentInstance.modalTitle = 'Information';
      modalRef.componentInstance.modalMessage = modalMessage;
    }
    //end of method onOpenModal
  

  //method to refesh the grid after closing the modal
  private getModalResultEventEmitter() {
    this.sapDetailsEmitService.getModalResultEventEmitter().
      subscribe(selectedSapDetailsRes => {
        console.log(" eventEmitter res from sap modal: ", selectedSapDetailsRes);
        this.setSapDetailsToGrid(selectedSapDetailsRes);//calling the method to set the sap details array
      },
        err => {
          console.log(err);
          this.sessionErrorService.routeToLander(err._body);
        });
  }//end of event emiiter result

  //method to set sap details array
  private setSapDetailsToGrid(selectedSapDetailsRes: any) {
    selectedSapDetailsRes.companyId = this.companyDetail.companyId;
    selectedSapDetailsRes.companyName = this.companyDetail.companyName;
    this.sapDetailsArr.push(selectedSapDetailsRes);//push the obj to the array
    this.setSlNo();//method to set slno to the array
  }//end of method

  //method to set serial no of grid
  private setSlNo() {
    let indexCount: number = 0;
    for (let selectedSapItem of this.sapDetailsArr) {
      selectedSapItem.slNo = indexCount + 1;
      indexCount++;
    }//end of for
    if (this.sapDetailsArr.length > 0) {
      let last: any = this.sapDetailsArr[this.sapDetailsArr.length - 1];
      console.log("last element of sapDetailsArr array..", last);
      this.slNo = last.slNo;
    } else {
      this.slNo = 0;
    }
    console.log("this.slNo..", this.slNo);
  }//end of method

  //method to set selected sap useFor array
  private setSelectedUseForArray() {
    if (this.sapDetailsArr) {
      for (let sapDet of this.sapDetailsArr) {
        this.nestedPushSelectedUseForArray(sapDet);//method to push element to selectec usefor arr by nested loop
        // this.selectedUseForArr.push(sapDet.useFor);
      }
    }
  }//end of method 
  //method to push element to selectec usefor arr by nested loop
  private nestedPushSelectedUseForArray(sapDet: any){
    if(this.selectedUseForArr.length > 0){
      for (let selectedUseFor of this.selectedUseForArr) {
        if(selectedUseFor === sapDet.useFor) {
        }else{
          this.selectedUseForArr.push(sapDet.useFor);
        }
      }//end of for
    }else{
      this.selectedUseForArr.push(sapDet.useFor);
    }//end of else
  }//end of method 

  //method to add table row by clicking on add items icon
  public onClickAddItemIcon() {
    console.log(" onClickAddItemIcon called");
    console.log("this.selectedUseForArr:::", this.selectedUseForArr);
    // this.slNo = this.slNo + 1;
    let localStorageUseForArr: string[] = [];
    localStorageUseForArr = this.localStorageService.appSettings.useFor;//set the useFor array from localstorage
    console.log("localStorageUseForArr in onClickAddItemIcon method..::",localStorageUseForArr);
    //checking both of UseFor array length 
    // if (localStorageUseForArr.length === this.selectedUseForArr.length) {
      if (localStorageUseForArr.length === this.sapDetailsArr.length) {
        console.log("length matched...");
        this.errMsgShowFlag = true;
        this.errorMsg = "Sorry! You have no records to add."
      }else{
      this.setSelectedUseForArray();//calling the method to set selected use for arr
      const modalRef = this.modalService.open(NgbdSapDetailModalComponent);
      modalRef.componentInstance.selectedUseForArr = this.selectedUseForArr;
      // modalRef.componentInstance.detailSettingsMaxLengthArr = this.detailSettings;
    }

  }//end of method  

  // method to remove selecteduseFor array
  private removeFromSelectedUseForArr(){
    for(let selectedSapItem of this.sapDetailsArr) {
      this.nestedRemoveSelectedUseForArr(selectedSapItem);//calling the method to remove selected usefor arr element
    }//rnf of for
  }//end of method
  
  //nested for loop method to remove selectedUseForArr element
  private nestedRemoveSelectedUseForArr(selectedSapItem:any) {
    let indexCount: number = 0;
    for(let selectedUseForEl of this.selectedUseForArr){
      if(selectedUseForEl === selectedSapItem.useFor){
        this.selectedUseForArr.splice(indexCount,1);
        break;
      }
    }//end of for
    indexCount ++;
  }//end of method

  //method to remove a row from sap grid
  public removeItemByCloseIcon(slno: number) {
    console.log("slno in removeItemByCloseIcon method..", slno);
    this.removeFromSelectedUseForArr();//calling the method to remove selected use for array element
    
    let indexCount: number = 0;
    for (let selectedSapItem of this.sapDetailsArr) {
      if (slno === selectedSapItem.slNo) {
        this.sapDetailsArr.splice(indexCount, 1);
        break;
      }//end of if
      indexCount++;
    }//end of for
    this.setSlNo();//calling the method to set slno of this array
    if(this.sapDetailsArr.length === 0) {
      this.selectedUseForArr = [];
    }
  }//end of method


  // radio click method
  public onEnableSslRadioClick(val) {
    this.enableSslValue = val;
    this.emailDetailsFormGroup.controls["enableSsl"].setValue(this.enableSslValue);
  }//end of method

  // radio click method
  public onBccRequiredRadioClick(val) {
    this.bccRequiredValue = val;
    this.emailDetailsFormGroup.controls["bccRequired"].setValue(this.bccRequiredValue);
  }//end of method

  // radio click method
  public onSentEmailRadioClick(val) {
    this.sentEmailValue = val;
    this.emailDetailsFormGroup.controls["sentEmail"].setValue(this.sentEmailValue);
  }//end of method

  //radio click method for change financial year
  public onChangeFinancialYearRadioClick(val) {
    this.changeFinancialYearValue = val;
    this.emailDetailsFormGroup.controls["changeFinancialYear"].setValue(this.changeFinancialYearValue);
  }//end of method

  //company details submit method 
  public onClickCompanyDetSubmit() {
    let companyDetJson: any = {};
    let sapDetArr: any[] = [];

    companyDetJson.address1 = this.companyDetailsFormGroup.value.address1;
    companyDetJson.address2 = this.companyDetailsFormGroup.value.address2;
    companyDetJson.bccRequired = this.emailDetailsFormGroup.value.bccRequired;
    companyDetJson.companyId = this.companyDetailsFormGroup.value.companyId;
    companyDetJson.companyName = this.companyDetailsFormGroup.value.companyName;
    companyDetJson.authenticationExpireInSecond = this.companyDetailsFormGroup.value.authenticationExpireInSecond;
    companyDetJson.details = this.sapDetailsArr;//sap array
    companyDetJson.emailId = this.emailDetailsFormGroup.value.emailId;
    companyDetJson.enableSsl = this.emailDetailsFormGroup.value.enableSsl;
    companyDetJson.financialYear = this.imageProcessingDetailsFormGroup.value.financialYear;
    companyDetJson.ftpProtocol = this.ftpServerDetailsFormGroup.value.ftpProtocol;    
    companyDetJson.ftpServer = this.ftpServerDetailsFormGroup.value.ftpServer;
    companyDetJson.ftpServerPublic = this.ftpServerDetailsFormGroup.value.ftpServerPublic;
    companyDetJson.ftpServerPort = this.ftpServerDetailsFormGroup.value.ftpServerPort;
    companyDetJson.ftpServerUser = this.ftpServerDetailsFormGroup.value.ftpServerUser;
    companyDetJson.ftpServerUserPassword = this.ftpServerDetailsFormGroup.value.ftpServerUserPassword;
    companyDetJson.gstin = this.companyDetailsFormGroup.value.gstin;
    companyDetJson.host = this.emailDetailsFormGroup.value.host;
    companyDetJson.imageOkPercentage = this.imageProcessingDetailsFormGroup.value.imageOkPercentage;
    companyDetJson.pass = this.emailDetailsFormGroup.value.pass;
    companyDetJson.phoneNo = this.companyDetailsFormGroup.value.phoneNo;
    companyDetJson.phoneStdCode = this.companyDetailsFormGroup.value.phoneStdCode;
    companyDetJson.pin = this.companyDetailsFormGroup.value.pin;
    companyDetJson.port = this.emailDetailsFormGroup.value.port;
    companyDetJson.changeFinancialYear = this.changeFinancialYearValue;
    if (this.changeFinancialYearValue === 'Y') {
      companyDetJson.scanNo = 0;
      companyDetJson.scanSeries = '';
    } else if (this.changeFinancialYearValue === 'N') {
      companyDetJson.scanNo = this.companyDetail.scanNo;
      companyDetJson.scanSeries = this.companyDetail.scanSeries;
    }
    companyDetJson.sendMailTimeoutLimit = this.emailDetailsFormGroup.value.sendMailTimeoutLimit;
    companyDetJson.sentEmail = this.emailDetailsFormGroup.value.sentEmail;
    companyDetJson.website = this.companyDetailsFormGroup.value.website;

    companyDetJson.applicationDomainName = this.applicationDetailsFormGroup.value.applicationDomainName;
    companyDetJson.applicationServerPublicIPAddress = this.applicationDetailsFormGroup.value.applicationServerPublicIPAddress;
    companyDetJson.applicationServerLocalIPAddress = this.applicationDetailsFormGroup.value.applicationServerLocalIPAddress;

    if(this.applicationDetailsFormGroup.value.applicationServerPortNo == null){
      companyDetJson.applicationServerPortNo = 0;  
    }else{
      companyDetJson.applicationServerPortNo = this.applicationDetailsFormGroup.value.applicationServerPortNo;
    }

    console.log("companyDetJson.......", companyDetJson);
    this.portalSettingsDataService.udateCompanyDetails(companyDetJson).
      subscribe(res => {
        console.log("res of company details..", res);
        if(res.msgType = "Info"){
          this.onOpenModal(res.msg);//calling modal
          this.router.navigate([ROUTE_PATHS.RouteHome]);
        }else{
          this.errMsgShowFlag = true;
          this.errorMsg = res.msg;
        }
      },
        err => {
          console.log("err of  company det..", err);
          this.sessionErrorService.routeToLander(err._body);
        })

  }//end of method

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick() {
    this.errMsgShowFlag = false;//to hide the error msg div
  }//method to delete error msg
  

  //method to show hide tab
  public onClickTab( val) {
    if (val === 'companyDetTab') {
      this.tabHideShow.companyDetTab = true;
      this.tabHideShow.emailDetTab = false;
      this.tabHideShow.ftpServerTab = false;
      this.tabHideShow.imageProcessingTab = false;
      this.tabHideShow.applicationDetTab = false;
      this.tabHideShow.sapTab = false;
    } else if (val === 'emailDetTab') {
      this.tabHideShow.companyDetTab = false;
      this.tabHideShow.emailDetTab = true;
      this.tabHideShow.ftpServerTab = false;
      this.tabHideShow.imageProcessingTab = false;
      this.tabHideShow.applicationDetTab = false;
      this.tabHideShow.sapTab = false;
    } else if (val === 'ftpServerTab') {
      this.tabHideShow.companyDetTab = false;
      this.tabHideShow.emailDetTab = false;
      this.tabHideShow.ftpServerTab = true;
      this.tabHideShow.imageProcessingTab = false;
      this.tabHideShow.applicationDetTab = false;
      this.tabHideShow.sapTab = false;
    } else if (val === 'imageProcessingTab') {
      this.tabHideShow.companyDetTab = false;
      this.tabHideShow.emailDetTab = false;
      this.tabHideShow.ftpServerTab = false;
      this.tabHideShow.imageProcessingTab = true;
      this.tabHideShow.applicationDetTab = false;
      this.tabHideShow.sapTab = false;
    } else if (val === 'applicationDetTab') {
      this.tabHideShow.companyDetTab = false;
      this.tabHideShow.emailDetTab = false;
      this.tabHideShow.ftpServerTab = false;
      this.tabHideShow.imageProcessingTab = false;
      this.tabHideShow.applicationDetTab = true;
      this.tabHideShow.sapTab = false;      
    } else if (val === 'sapTab') {
      this.tabHideShow.companyDetTab = false;
      this.tabHideShow.emailDetTab = false;
      this.tabHideShow.ftpServerTab = false;
      this.tabHideShow.imageProcessingTab = false;
      this.tabHideShow.applicationDetTab = false;
      this.tabHideShow.sapTab = true;
    }
  }//end of method

  //method to cancel
  public onCancel(){
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }

  // ==edit modal==
  editModal: boolean = false;
  //end of new add
  private toggleEditCompTypeModal() {
    this.editModal = this.editModal ? false : true;
  }

  private resetEditModalData(){
    this.editSAPItemFormGroup.controls['useFor'].setValue('');
    this.editSAPItemFormGroup.controls['sapCompanyCode'].setValue('');
    this.editSAPItemFormGroup.controls['sapDescription'].setValue('');
    this.editSAPItemFormGroup.controls['sapApplicationServer'].setValue('');
    this.editSAPItemFormGroup.controls['sapSystemNo'].setValue('');
    this.editSAPItemFormGroup.controls['sapSystemId'].setValue('');
    this.editSAPItemFormGroup.controls['sapLanguage'].setValue('');
    this.editSAPItemFormGroup.controls['sapRouter'].setValue('');
    this.editSAPItemFormGroup.controls['sapClient'].setValue('');
    this.editSAPItemFormGroup.controls['sapUser'].setValue('');
    this.editSAPItemFormGroup.controls['sapUserPassword'].setValue('');
    this.editSAPItemFormGroup.controls['sapPhysicalPath'].setValue('');
  }

  public cancelModal(){
    this.resetEditModalData();//clear all data  
      this.toggleEditCompTypeModal();
  }

//method to open modal
  openEditModal(selectedEl){
    this.editSAPItemFormGroup.controls['useFor'].setValue(selectedEl.useFor);
    this.editSAPItemFormGroup.controls['sapCompanyCode'].setValue(selectedEl.sapCompanyCode);
    this.editSAPItemFormGroup.controls['sapDescription'].setValue(selectedEl.sapDescription);
    this.editSAPItemFormGroup.controls['sapApplicationServer'].setValue(selectedEl.sapApplicationServer);
    this.editSAPItemFormGroup.controls['sapSystemNo'].setValue(selectedEl.sapSystemNo);
    this.editSAPItemFormGroup.controls['sapSystemId'].setValue(selectedEl.sapSystemId);
    this.editSAPItemFormGroup.controls['sapLanguage'].setValue(selectedEl.sapLanguage);
    this.editSAPItemFormGroup.controls['sapRouter'].setValue(selectedEl.sapRouter);
    this.editSAPItemFormGroup.controls['sapClient'].setValue(selectedEl.sapClient);
    this.editSAPItemFormGroup.controls['sapUser'].setValue(selectedEl.sapUser);
    this.editSAPItemFormGroup.controls['sapUserPassword'].setValue(selectedEl.sapUserPassword);
    this.editSAPItemFormGroup.controls['sapPhysicalPath'].setValue(selectedEl.physicalPath);
    this.toggleEditCompTypeModal();//to open modal
  }

  updateSapItem(){
    let useFor = this.editSAPItemFormGroup.value.useFor;
    if(this.editSAPItemFormGroup.valid){
      this.sapDetailsArr.forEach((arrel,index)=>{
        if(arrel.useFor == useFor){
          arrel.sapCompanyCode = this.editSAPItemFormGroup.value.sapCompanyCode;
          arrel.sapDescription = this.editSAPItemFormGroup.value.sapDescription;
          arrel.sapApplicationServer = this.editSAPItemFormGroup.value.sapApplicationServer;
          arrel.sapSystemNo = this.editSAPItemFormGroup.value.sapSystemNo;
          arrel.sapSystemId = this.editSAPItemFormGroup.value.sapSystemId;
          arrel.sapLanguage = this.editSAPItemFormGroup.value.sapLanguage;
          arrel.sapRouter = this.editSAPItemFormGroup.value.sapRouter;
          arrel.sapClient = this.editSAPItemFormGroup.value.sapClient;
          arrel.sapUser = this.editSAPItemFormGroup.value.sapUser;
          arrel.sapUserPassword = this.editSAPItemFormGroup.value.sapUserPassword;
          arrel.physicalPath = this.editSAPItemFormGroup.value.sapPhysicalPath;  
        }
      });  
      this.resetEditModalData();//clear all data  
      this.toggleEditCompTypeModal();
    }    
  }//end of method

 

}//end of class