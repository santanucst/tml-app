import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { ToastService } from "../../../../home/services/toast-service";
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { NgbdModalComponent } from '../../../../widget/modal/components/modal-component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdItemNoModalComponent } from '../../item-no-modal/item-no-modal.component';
import { DebitNoteAddEditDataService } from "../../../services/debit-note-add-edit-data.service";
import { ItemNoEmitService } from "../../../services/item-no-emit.service";
import { ItemDetailsService } from "../../../services/item-details.service";
import { DatePipe } from '@angular/common';
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { FileDownloadService } from "../../../../shared/services/file-download.service";

@Component({
  selector: 'ispl-debit-note-add-edit-form',
  templateUrl: 'debit-note-add-edit.component.html',
  styleUrls: ['debit-note-add-edit.component.css']
})

export class DebitNoteAddEditComponent implements OnInit {
  public title: string = "Add Debit Note";
  public invoiceAddEditFormGroup: FormGroup;
  public modalFormGroup: FormGroup;
  public itemListFormGroup: FormGroup;//for creating poUnit drodown 17.09.18
  public itemDescListFormGroup: FormGroup;//for creating poUnit drodown 17.09.18
  public vendorName: string = "";//to store vendor name
  public vendorGstInNo: string = "";//to store vendor gst in no
  public vendorPanNo: string = "";//to store vendor pan no
  public vendorGstInNoError: boolean = false;
  public companyGstinNo: string = this.localStorageService.appSettings.companyGstin;//to store company gst in no
  public companyGstinNoError: boolean = false;
  public vendorBoolean: boolean = false;
  public userType: string = "";//to store userType
  public code: string = "";//to store code
  public selectedPONo: string = "";//to store route param
  public invoiceNo: string = "";//to store invoiceNo
  public invoiceDate: string = "";//to store invoice date
  public poDate: string = "";//to store po date
  public poType: string = "";//to store poType
  public poUnit: string = "";//to store poUnit
  public orderQty: string = "";//to store poUnit
  public headName: string = "";//to store headName
  public servicePOFlag: boolean = false;
  // public vendorCode: string;//to store selected vendor code from route param
  // form data for file upload
  private formData: FormData = new FormData();
  private fileData: FormData;
  private tempDescDropDownVal: any[] = []; //to store selected  desc for other docs temporary 
  public descDropDownVal: any[] = []; //to store  desc for other docs 
  public poNoDropDownVal: any[] = []; //to store  poNo 
  public invoiceNoDropDownVal: any[] = []; //to store  invoiceNo
  public checkedItemArr: any[] = [];//to get the selected items from modal
  public addItemDescArr: any[] = [];//to get the added items desc
  public fileList: FileList;
  public itemsHeader: any = {}; // to store the item header
  public totalInvoiceAmount: number = 0;//to store total invoice amount
  public totalCgstAmount: number = 0;//to store total cgst amount
  public totalSgstAmount: number = 0;//to store total sgst amount
  public totalIgstAmount: number = 0;//to store total igst amount
  public totalAmount: number = 0;//(totalInvoiceAmount + totalCgstAmount + totalSgstAmount + totalIgstAmount)
  //for item qty error, cgst error, igst error
  public itemValueError: boolean = false;
  public itemQtyCgstIgstError: boolean = true;
  public invoiceFileErrFlag: boolean = false;//to show the invoice file err div
  public otherDocFileErrFlag: boolean = false;//to show the other file err div
  public fileErrMsg: string = "";//to show the file err msg 
  public invoiceFilesArr: any[] = [];//to store the invoice file url and name 
  public otherFilesArr: any[] = [];//to store the other docs file url and name 
  public itemNameLength: number = this.localStorageService.dbSettings.itemDesc;
  public drcrnoteLength: number = this.localStorageService.dbSettings.drcrnoteNumber;
  public itemReasonLength: number = this.localStorageService.dbSettings.itemReason;
  public debitNoteDateError: boolean = false;
  public debitNoteDateErrorDesc: string = "";
  public submitError: boolean = false;
  public submitErrorMsg: string = "";
  public invoiceFileSubmitError: boolean = false;
  public invoiceFileSubmitErrorMsg: string = "";
  public otherFileSubmitError: boolean = false;
  public otherFileSubmitErrorMsg: string = "";
  public vendorCodeError: boolean = false;
  public vendorCodeErrorDesc: string = "";
  public division: string = "";//to store division value 15.11.18
  public codeDeatils: any = [];
  public codeDetError: boolean = false;
  @ViewChild('otherDocs') //to refresh the file name for other docs field from html
  public otherDocs: any;//taking variable to refresh the file name for other docs field from html
  @ViewChild('invoiceDoc')//to refresh the file name for invoice docs field from html
  public invoiceDoc: any;//taking variable to refresh the file name for invoice docs field from html
  public itemValueErrFlag: boolean = false;//to itemValue err flag
  public otherDescDropDownVal: any[] = [];//to store desc dropdown value
  //busySpinner 
  public busySpinner: any = {
    fileuploadBusy: false,
    selectedBusy: false,
    submitBusy: false,//for submit spinner
    busy: false
  }

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private debitNoteAddEditDataService: DebitNoteAddEditDataService,
    private itemNoEmitService: ItemNoEmitService,
    private itemDetailsService: ItemDetailsService,
    private datePipe: DatePipe,
    private sessionErrorService: SessionErrorService,
    private router: Router,
    private fileDownloadService: FileDownloadService
  ) {
    this.initform();
    this.initFormForItemList();

  }//end of constructor

  ngOnInit(): void {
    this.otherDescDropDownVal = [
      { key: 'Freight', value: 'Freight' },
      { key: 'Rent', value: 'Rent' },
      { key: 'Detention', value: 'Detention' },
      { key: 'Other', value: 'Other' }
    ];
    if (this.companyGstinNo == "") {
      this.companyGstinNoError = true;
    }

    console.log("this.itemDetailsService.testVar=====>>>>>>>>>", this.itemDetailsService.testVar)
    if (!this.itemDetailsService.testVar) {
      this.clearInvDetService();
    }

    let prevPlantType: string = this.itemDetailsService.plantType;
    if (prevPlantType != undefined) {
      this.division = prevPlantType;
      this.invoiceAddEditFormGroup.controls['division'].setValue(this.division);
    }
    console.log(" division ", this.division);
    this.getRouteParam();//to get route param
    this.getSelectedDescValWs();//calling method to get desc for other doc from webservice
    this.getUserType();//get user type from localstorage 
    this.getModalResultEventEmitter();
    // this.vendorName = this.itemDetailsService.vendorName;
    console.log(" Gst number:::::::::::::::", this.localStorageService.appSettings.companyGstin);
    this.poNoDropDownVal = [
      { key: '', value: '-- Select --' }
    ];
    this.invoiceNoDropDownVal = [
      { value: '', key: '-- Select --' }
    ];
    this.onDivisionChoose();
  }//end of onInit

  /**
  * @description init form data
  */
  initform() {
    this.invoiceAddEditFormGroup = new FormGroup({
      poNo: new FormControl('', Validators.required),
      invoiceNo: new FormControl('', Validators.required),
      headName: new FormControl(''),
      debitNoteNumber: new FormControl('', Validators.required),
      debitNoteDate: new FormControl('', Validators.required),
      debitNoteAmount: new FormControl(''),
      totalIgst: new FormControl(''),
      totalAmount: new FormControl(''),
      otherDocDesc: new FormControl(''),
      itemDesc: new FormControl(''),
      division: new FormControl('', Validators.required),
    });
    // creating initial formcontrol for itemListFormGroup 15.11.18
    this.itemDescListFormGroup = this.formBuilder.group({
      dummyformcontrol: new FormControl(''),
    });
    this.modalFormGroup = this.formBuilder.group({
      divisionM: new FormControl('', Validators.required)
    });
  }//end of method

  //start method of initFormForItemList
  initFormForItemList() {
    // creating initial formcontrol for itemListFormGroup 19.09.18
    this.itemListFormGroup = this.formBuilder.group({
      dummyformcontrol: new FormControl(''),
    });
  }//end method of initFormForItemList

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.code = params.vendorCode ? params.vendorCode : '';
    });
    console.log("vendorCode for Invoice Add/edit: ", this.code);
  }//end of method to get route param

  private clearInvDetService() {
    this.itemDetailsService.plantType = "";
    this.itemDetailsService.vendorName = ""
    this.itemDetailsService.vendorGstin = "";
    this.itemDetailsService.vendorPanNo = "";
  }

  //start method to get usertype from local storage 16.11.18
  private getUserType() {
    console.log(" getUserType method called");
    this.userType = this.localStorageService.user.userType;
    if (this.userType === 'V') {
      this.code = "";
      //this.code = this.localStorageService.user.code;
      this.vendorName = this.localStorageService.user.name;
      this.vendorGstInNo = this.localStorageService.user.vendorGstin.trim();
      this.vendorPanNo = this.localStorageService.user.vendorPanNo.trim();
      this.codeDeatils = this.localStorageService.user.codeDetails;
      for(let codeDetEl of  this.codeDeatils)  {
        if(this.division == codeDetEl.plantType && this.division){
          this.code =  codeDetEl.code;
          this.codeDetError = false;
          break;
        }else if(this.division != codeDetEl.plantType && this.division){
          this.code = "";
          this.codeDetError = true;
          break;
        }
      }//end of for
      if (this.code || this.vendorName || this.vendorGstInNo || this.vendorPanNo) {
        this.vendorBoolean = true;
      }
      if (this.vendorGstInNo == "" && this.vendorPanNo == "") {
        this.vendorGstInNoError = true;
        console.log(" vendorGstInNoError ", this.vendorGstInNoError);
      }//end of if
      if (this.code && this.division && (this.vendorGstInNo || this.vendorPanNo)) {
        this.getPONosWs(this.code, this.vendorGstInNo, this.division);
      }
    } else if (this.userType === 'E') {
      this.getvendorNameFromModlResult();//get vendor name by modal result
      if (this.code || this.vendorName || this.vendorGstInNo || this.vendorPanNo) {
        this.vendorBoolean = true;
      }
      if (this.code && this.division && (this.vendorGstInNo || this.vendorPanNo)) {
        this.getPONosWs(this.code, this.vendorGstInNo, this.division);
      }//end of if
    }//end of else if
  }//end of the method


  //start method of getPONosWs to get po nos fom webservice
  private getPONosWs(code: string, vendorGstInNo: string, division: string) {
    this.busySpinner.selectedBusy = true;
    this.updateBusySpinner();
    this.debitNoteAddEditDataService.getPONosVal(code, vendorGstInNo, division).
      subscribe(res => {
        console.log(" po nos========>>>>>>>>>>", res);
        this.poNoDropDownVal = res.details;
        this.busySpinner.selectedBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log("pono err:", err);
          this.sessionErrorService.routeToLander(err._body);
          this.busySpinner.selectedBusy = false;
          this.updateBusySpinner();
        });
  }//end of the method getPONosWs

  //method to get vendor name by modal result 16.11.18
  private getvendorNameFromModlResult() {
    if (this.userType === 'E') {
      this.vendorName = this.itemDetailsService.vendorName;
      this.vendorGstInNo = this.itemDetailsService.vendorGstin.trim();
      this.vendorPanNo = this.itemDetailsService.vendorPanNo.trim();
      let prevPlantType: string = this.itemDetailsService.plantType;
      if (prevPlantType != undefined) {
        this.division = prevPlantType;
        this.invoiceAddEditFormGroup.controls['division'].setValue(this.division);
      }
      if (this.vendorGstInNo == "" && this.vendorPanNo == "") {
        this.vendorGstInNoError = true;
        console.log(" vendorGstInNoError ", this.vendorGstInNoError);
      }//end of if
    }//end of if
  }//end of method

  //method of submit modify allocate complaint
  private onFileUploadWS(paramValue: string) {
    // console.log("userId for fileUpload on invoice add edit component : ", this.lo);    
    this.formData.append('userId', this.localStorageService.user.userId);
    // this.formData.append('Authorization', 'bearer ' + this.localStorageService.user.accessToken);
    //method to add or update preli
    if (this.fileData != undefined) {
      for (let i: number = 0; i < this.fileList.length; i++) {
        console.log(" file upload", this.fileData.get('files' + i.toString()));
        //   if (this.fileData.get('files' + i.toString()) != null) {
        this.formData.append('files', this.fileData.get('files' + i.toString()));
        //   }//end of if
      }//end of for
    }//end of if fileData is !undefined
    let formDataObj: any = {};
    formDataObj = this.formData;
    // this.busySpinner.submitBusy = true;

    this.busySpinner.fileuploadBusy = true;
    this.updateBusySpinner();
    this.debitNoteAddEditDataService.fileUpload(formDataObj, paramValue).
      subscribe(res => {
        console.log("file upload Response: ", res);
        //     this.busySpinner.submitBusy = false;
        //     this.updateBusySpinner();
        //     this.resErrorType = res.msgType;
        if (res.msgType === "Info") {
          this.invoiceFileSubmitError = false;
          this.otherFileSubmitError = false;
          if (paramValue === 'DR_NOTE') {
            this.invoiceFilesArr.push({ fileUrl: res.value, fileName: res.valueSub });
            console.log("invoiceFilesArr ====>>>>>>>>>>>>>>>>>>>", this.invoiceFilesArr);
          } else {
            this.otherFilesArr.push({ fileUrl: res.value, fileName: res.valueSub, docName: paramValue });
            this.rearrangeDescDropDownVal("remove");
            this.getDescValueFromArr();
          }//end of else

        } else if (res.msgType === "Error") {
          if (paramValue === 'DR_NOTE') {
            this.invoiceFileSubmitError = true;
            this.invoiceFileSubmitErrorMsg = res.msg;
          } else {
            this.otherFileSubmitError = true;
            this.otherFileSubmitErrorMsg = res.msg;
          }//end od else

        }//end of else if
        this.formData = new FormData();//new instance create of formdata
        this.busySpinner.fileuploadBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log("file upload Response: ", err);
          //     if (err.status == 401) {
          //       this.resErrorMsg = "Sorry! Unable to save data. Please try again.";
          //     } else {
          //       this.resErrorMsg = "Netowrk/Server Problem";
          //     }
          this.formData = new FormData();//new instance create of formdata
          this.busySpinner.fileuploadBusy = false;
          this.updateBusySpinner();
        });
  } //end of method submit modify capa actn pi

  private fileDeleteWs(paramValue: string, fileName: string) {
    let fileDetails: any = {};
    console.log(" this.otherFilesArr========== ", this.otherFilesArr);
    fileDetails.userId = this.localStorageService.user.userId;
    fileDetails.fileName = fileName;
    this.debitNoteAddEditDataService.fileDelete(fileDetails, paramValue).
      subscribe(res => {
        console.log("delete files res ", res);
        if (res.msgType === "Info") {
          if (paramValue === 'DR_NOTE') {
            this.invoiceFilesArr = [];//to remove files from invoice array
          } else if (paramValue === 'others') {
            let indexCount: number = 0;
            let removeFlag: boolean = false;
            for (let othrFileArr of this.otherFilesArr) {
              if (othrFileArr.fileName === res.value) {
                console.log(" file name==>>>>>>>>>>>>>", othrFileArr.fileName);
                this.rearrangeDescDropDownVal("insert", othrFileArr.docName);
                this.otherFilesArr.splice(indexCount, 1);
                removeFlag = true;
                break;
              }//end of if
              indexCount++;
            }//end of for
            console.log(" items of otherFilesArr array ", this.otherFilesArr);
          }//end of else
        }//end of if
      },
        err => {
          console.log(err);
          this.sessionErrorService.routeToLander(err._body);
          // this.busySpinner.compRefDetBusy = false;//busy spinner
          // this.updateBusySpinner();//method for busy spinner
        });
  }

  //method to get desc for other doc from webservice
  private getSelectedDescValWs() {
    this.debitNoteAddEditDataService.getSelectedDescVal().
      subscribe(res => {
        console.log("get the desc dropdown ", res);
        if (res.msgType === "Info") {
          this.descDropDownVal = res.details;
          for (let desc of this.descDropDownVal) {
            if (desc.key === "") {
              this.invoiceAddEditFormGroup.controls["otherDocDesc"].setValue(desc.key);//to set zeroth value selected
            }//end of if
          }//end of for
        }//end of if
      },
        err => {
          console.log(err);
          this.sessionErrorService.routeToLander(err._body);
          // this.busySpinner.compRefDetBusy = false;//busy spinner
          // this.updateBusySpinner();//method for busy spinner
        });
  }

  //start medthod onVendorCodeKeyUp to check the vendor code
  public onVendorCodeKeyUp(vendorCode: string) {
    if (!vendorCode) {
      this.vendorCodeError = false;
      this.vendorCodeErrorDesc = "";
    } else if (vendorCode === '"' || vendorCode === "'" || vendorCode.indexOf("'") === (vendorCode.length - 1) || vendorCode.indexOf('"') === (vendorCode.length - 1)) {
      this.vendorCodeError = true;
      this.vendorCodeErrorDesc = "Vendor Code can't contain single quotes or double quotes";
    } else {
      this.vendorCodeError = false;
      this.vendorCodeErrorDesc = "";
    }//end of else
  }//end of the method onVendorCodeKeyUp

  //to refresh the file name field
  public resetFileInput(paramValue: string) {
    if (paramValue === 'DR_NOTE') {
      //calling the service method to upload file
      this.onFileUploadWS(paramValue);
      // console.log(this.invoiceDoc.nativeElement.files);
      this.invoiceDoc.nativeElement.value = "";
    } else if (paramValue === 'others') {
      paramValue = this.invoiceAddEditFormGroup.value.otherDocDesc;
      this.onFileUploadWS(paramValue);
      // this.rearrangeDescDropDownVal("remove");
      // this.getDescValueFromArr();
      // console.log(this.otherDocs.nativeElement.files);
      this.otherDocs.nativeElement.value = "";
    }//end of else
  }//end of the method reset

  //method to push desc value to the others file array
  private getDescValueFromArr() {
    this.otherFilesArr.forEach(othrfile => {
      this.tempDescDropDownVal.forEach(tmpDesc => {
        if (tmpDesc.key === othrfile.docName) {
          othrfile.fileDescVal = tmpDesc.value;
        }
      });
      console.log("othrfile==>>> ", othrfile);
    });
    console.log(" updated other file array ", this.otherFilesArr);
  }//end of method

  //method to rearrange drop down val
  private rearrangeDescDropDownVal(descRemoveInsertParam: string, descParam?: string) {
    let indexCount: number = 0;
    let removeFlag: boolean = false;
    if (descRemoveInsertParam === 'remove') {
      let otherDescKey: string = this.invoiceAddEditFormGroup.value.otherDocDesc;
      for (let desc of this.descDropDownVal) {
        if (desc.key === otherDescKey) {
          this.tempDescDropDownVal.push({ key: desc.key, value: desc.value });// storing the selected desc temporay
          this.descDropDownVal.splice(indexCount, 1);// removing the selected desc from desc drop down
          removeFlag = true;
          break;
        }
        indexCount++;
      }//end of for
    } else if (descRemoveInsertParam === 'insert') {
      for (let tempDesc of this.tempDescDropDownVal) {
        if (tempDesc.key === descParam) {
          this.descDropDownVal.push(tempDesc);// storing the selected desc temporay
          this.tempDescDropDownVal.splice(indexCount, 1);// removing the selected desc from desc drop down
          removeFlag = true;
          break;
        }
        indexCount++;
      }//end of for
    }
    //to set zeroth value selected
    for (let desc of this.descDropDownVal) {
      if (desc.key === "") {
        this.invoiceAddEditFormGroup.controls["otherDocDesc"].setValue(desc.key);//to set zeroth value selected
      }//end of if
    }//end of for
  }

  //method to refesh the grid after closing the modal
  private getModalResultEventEmitter() {
    this.itemNoEmitService.getModalResultEventEmitter().
      subscribe(selectedItemDetailsRes => {
        console.log(" eventEmitter res : ", selectedItemDetailsRes);
        if (this.checkedItemArr.length == 0) {
          for (let selectedDetRes of selectedItemDetailsRes) {
            this.checkedItemArr.push(selectedDetRes);
          }//end of for
        } else {
          for (let selectedDetRes of selectedItemDetailsRes) {
            this.getDistinctItmsGrid(selectedDetRes);
          }//end of for 
        }//end of else
        this.getGstPercentage();
        this.getItemQtyTaxRateItemName();
        this.createItemFormgroupForSelectedItem();//calling createItemFormgroupForSelectedItem to create dynamic formgroup 17.09.18
      },
        err => {
          console.log(err)
        });
  }//end of event emiiter result

  //to create formgroup for selected item 17.09.18
  private createItemFormgroupForSelectedItem() {
    //this.convUnitFlag =
    //creating an object for formgroup
    let itmFrmgroup: any = {};

    // iterating checkedItemArr to push the hardcoded conversion json and creationg dynamic formcontrol
    this.checkedItemArr.forEach(chckedItm => {
      console.log(" formGroup created");
      //this.convUnitFlag = false;
      //pushing hardcoded uomQuantity 
      if (!chckedItm.uomQuantity) {
        chckedItm.uomQuantity = 0;
      }
      //end of pushing hardcoded conversionArr to checkedItemArr array    

      // creating key
      let key = chckedItm.slNo;
      let convQtyKey = key + "_" + "convQty";
      let convUnitKey = key + "_" + "convUnit";
      let itemDescKey = key + "_" + "itemDesc";
      let taxRateKey = key + "_" + "taxRate";
      let hsnCodeKey = key + "_" + "hsnCode";
      // let itemValueKey = key + "_" + "itemValue";

      //creating dynamic formcontrol
      chckedItm.convQtyKey = convQtyKey;
      chckedItm.convUnitKey = convUnitKey;
      chckedItm.itemDescKey = itemDescKey;
      chckedItm.taxRateKey = taxRateKey;
      chckedItm.hsnCodeKey = hsnCodeKey;
      //chckedItm.itemValueKey = itemValueKey;

      itmFrmgroup[convQtyKey] = new FormControl(chckedItm.uomQuantity, Validators.required);
      itmFrmgroup[itemDescKey] = new FormControl(chckedItm.itemName.trim(), Validators.required);
      itmFrmgroup[hsnCodeKey] = new FormControl(chckedItm.hsnCode);
      //itmFrmgroup[itemValueKey] = new FormControl(chckedItm.itemValue, Validators.required);

      let count: number = 0;
      let itemUom: string = "";
      if(chckedItm.conversion.length == 1){
        itemUom = chckedItm.conversion[0].itemUnit;
      }
      for (let itmList in this.itemListFormGroup.value) {
        if (itmList == 'dummyformcontrol') {
          chckedItm.itemUom = itemUom;
          itmFrmgroup[convUnitKey] = new FormControl(chckedItm.itemUom, Validators.required);
          break;
        } else {
          if (itmList == chckedItm.convUnitKey && chckedItm.itemUom) {
            itmFrmgroup[convUnitKey] = new FormControl(chckedItm.itemUom, Validators.required);
            break;
          } else if (count == 0) {
            chckedItm.itemUom = itemUom;
            itmFrmgroup[convUnitKey] = new FormControl(chckedItm.itemUom, Validators.required);
            //count++; 
            break;
          }//end of else if
        }//end of else
      }//end of for

      //creating formgroup
      this.itemListFormGroup = new FormGroup(itmFrmgroup);

      //newly added 17.09.18
      //this.itemListFormGroup.valueChanges.subscribe(() => this.onItemUnitChanges());
      
    });
    console.log("this.checkedItemArr====", this.checkedItemArr);
  }//end of the method 17.09.18

  //start meyhod to get gst percentage
  private getGstPercentage() {
    console.log(" getGstPercentage method called ");
    for (let chkItm of this.checkedItemArr) {
      if (chkItm.taxRate != 0) {
        this.onKeyupToGenerateCgstIgstSgst(chkItm.taxRate, chkItm.itemCode);
      }//end of if
    }//end of for
  }//end of the method


  //start method to check itemqty,taxRate is greater than zero or not and item name is empty or not
  private getItemQtyTaxRateItemName(checkedItmParam?: any) {
    for (let chkItm of this.checkedItemArr) {
      if ((chkItm.taxRate === 0 || chkItm.taxRate < 0) || !chkItm.itemName || (chkItm.itemValue === 0 || chkItm.itemValue < 0)) {
        if ((this.poType === "ZRDM" || this.poType === "ZCDM") && checkedItmParam) {
          console.log(" material po");
          if (checkedItmParam.itemCode === chkItm.itemCode && checkedItmParam.lineItemNo === chkItm.lineItemNo) {
            if (chkItm.taxRate === 0) {
              if (this.vendorGstInNo) {
                if (!chkItm.uiTaxtRateErrFlag) {
                  chkItm.uiTaxtRateErrFlag = true;
                  if (!chkItm.uiTaxtRateErrDesc) {
                    chkItm.uiTaxtRateErrDesc = '';
                  }//end of if
                }//end of if
              } else {
                chkItm.uiTaxtRateErrFlag = false;
                chkItm.uiTaxtRateErrDesc = '';
              }

            } else if (!chkItm.itemName) {
              if (!chkItm.uiItemNameErrFlag || chkItm.uiItemNameErrFlag === undefined) {
                chkItm.uiItemNameErrFlag = true;
                if (!chkItm.uiItemNameErrDesc) {
                  chkItm.uiItemNameErrDesc = '';
                }//end of if
              }//end of if
            }//end of else if
            this.itemQtyCgstIgstError = true;
            break;
          } else {
            this.itemQtyCgstIgstError = false;
          }//end of else
        } else if ((this.poType === "ZRDS" || this.poType === "ZCDS") && checkedItmParam) {
          console.log(" service po");
          if (checkedItmParam.itemName === chkItm.itemName && checkedItmParam.lineItemNo === chkItm.lineItemNo && checkedItmParam.itemNo === chkItm.itemNo) {
            if (checkedItmParam.poUnit === 'JOB' && checkedItmParam.orderQty === 1) {
              chkItm.itemQuantity = checkedItmParam.orderQty;
              if (chkItm.itemValue === 0) {
                chkItm.uiItemValueErrFlag = true;
                this.itemValueErrFlag = true;
                if (!chkItm.uiItemValueErrDesc) {
                  chkItm.uiItemValueErrDesc = '';
                }//end of if
              }//end of if
            }//end of if
            else if (chkItm.taxRate === 0) {
              if (this.vendorGstInNo) {
                if (!chkItm.uiTaxtRateErrFlag) {
                  chkItm.uiTaxtRateErrFlag = true;
                  if (!chkItm.uiTaxtRateErrDesc) {
                    chkItm.uiTaxtRateErrDesc = '';
                  }//end of if
                }//end of if
              } else {
                chkItm.uiTaxtRateErrFlag = false;
                chkItm.uiTaxtRateErrDesc = '';
              }
            } else if (!chkItm.itemName) {
              if (!chkItm.uiItemNameErrFlag || chkItm.uiItemNameErrFlag === undefined) {
                chkItm.uiItemNameErrFlag = true;
                if (!chkItm.uiItemNameErrDesc) {
                  chkItm.uiItemNameErrDesc = '';
                }//end of if
              }//end of if
            }//end of else if
            this.itemQtyCgstIgstError = true;
            break;
          } else {
            this.itemQtyCgstIgstError = false;
          }//end of else
        } else if ((this.poType === "ZC" || this.poType === "ZR" || this.poType === "ZI") && checkedItmParam) {//for pi
          //if (checkedItmParam.itemCode && checkedItmParam.packageNo) {
          if (!checkedItmParam.packageNo) {
            console.log(" material po");
            if (checkedItmParam.itemCode === chkItm.itemCode && checkedItmParam.lineItemNo === chkItm.lineItemNo) {
              if (chkItm.taxRate === 0) {
                if (this.vendorGstInNo) {
                  if (!chkItm.uiTaxtRateErrFlag) {
                    chkItm.uiTaxtRateErrFlag = true;
                    if (!chkItm.uiTaxtRateErrDesc) {
                      chkItm.uiTaxtRateErrDesc = '';
                    }//end of if
                  }//end of if
                } else {
                  chkItm.uiTaxtRateErrFlag = false;
                  chkItm.uiTaxtRateErrDesc = '';
                }
              } else if (!chkItm.itemName) {
                if (!chkItm.uiItemNameErrFlag || chkItm.uiItemNameErrFlag === undefined) {
                  chkItm.uiItemNameErrFlag = true;
                  if (!chkItm.uiItemNameErrDesc) {
                    chkItm.uiItemNameErrDesc = '';
                  }//end of if
                }//end of if
              }//end of else if
              this.itemQtyCgstIgstError = true;
              break;
            } else {
              this.itemQtyCgstIgstError = false;
            }//end of else
          // } else if (!checkedItmParam.itemCode && !checkedItmParam.packageNo) {
          } else if (checkedItmParam.packageNo) {
            console.log(" service po");
            if (checkedItmParam.itemName === chkItm.itemName && checkedItmParam.lineItemNo === chkItm.lineItemNo && checkedItmParam.itemNo === chkItm.itemNo) {
              if (checkedItmParam.poUnit === 'JOB' && checkedItmParam.orderQty === 1) {
                chkItm.itemQuantity = checkedItmParam.orderQty;
                if (chkItm.itemValue === 0) {
                  chkItm.uiItemValueErrFlag = true;
                  this.itemValueErrFlag = true;
                  if (!chkItm.uiItemValueErrDesc) {
                    chkItm.uiItemValueErrDesc = '';
                  }//end of if
                }//end of if
              }//end of if
              else if (chkItm.taxRate === 0) {

                if (this.vendorGstInNo) {
                  if (!chkItm.uiTaxtRateErrFlag) {
                    chkItm.uiTaxtRateErrFlag = true;
                    if (!chkItm.uiTaxtRateErrDesc) {
                      chkItm.uiTaxtRateErrDesc = '';
                    }//end of if
                  }//end of if
                } else {
                  chkItm.uiTaxtRateErrFlag = false;
                  chkItm.uiTaxtRateErrDesc = '';
                }
              } else if (!chkItm.itemName) {
                if (!chkItm.uiItemNameErrFlag || chkItm.uiItemNameErrFlag === undefined) {
                  chkItm.uiItemNameErrFlag = true;
                  if (!chkItm.uiItemNameErrDesc) {
                    chkItm.uiItemNameErrDesc = '';
                  }//end of if
                }//end of if
              }//end of else if
              this.itemQtyCgstIgstError = true;
              break;
            } else {
              this.itemQtyCgstIgstError = false;
            }//end of else

          }//end of else if
        } else if (!checkedItmParam) {
          if (chkItm.taxRate === 0)
            if (this.vendorGstInNo) {
              if (!chkItm.uiTaxtRateErrFlag) {
                chkItm.uiTaxtRateErrFlag = true;
                if (!chkItm.uiTaxtRateErrDesc) {
                  chkItm.uiTaxtRateErrDesc = '';
                }//end of if
              }//end of if
            } else if (!chkItm.itemName) {
              if (!chkItm.uiItemNameErrFlag || chkItm.uiItemNameErrFlag === undefined) {
                chkItm.uiItemNameErrFlag = true;
                if (!chkItm.uiItemNameErrDesc) {
                  chkItm.uiItemNameErrDesc = '';
                }//end of if
              }//end of if
            }//end of else if
          this.itemQtyCgstIgstError = true;
          break;
        } else {
          this.itemQtyCgstIgstError = false;
        }//end of else
      } else {
        this.itemQtyCgstIgstError = false;
      }
    }//end of for
  }//end of the method



  //start method getDistinctItmsGrid to insert distinct items details into the item details grid
  private getDistinctItmsGrid(selectedDetRes: any) {
    let prevKey: string = "";
    let lastKey: string = "";

    let prevKeyItemName: string = "";
    let lastKeyItemName: string = "";

    let prevKeyLineItemNo: string = "";
    let lastKeyLineItemNo: string = "";

    let prevKeyItemNo: string = "";
    let lastKeyItemNo: string = "";


    console.log("selectedDetRes::::::", selectedDetRes);
    this.poType = selectedDetRes.poType;
    for (let checkedItm of this.checkedItemArr) {
      if (this.poType === "ZRDS" || this.poType === "ZCDS") {
        console.log(" service po ");
        if (selectedDetRes.itemName === checkedItm.itemName && selectedDetRes.lineItemNo === checkedItm.lineItemNo && selectedDetRes.itemNo === checkedItm.itemNo) {
          console.log("item name, line item  no and item no are matched..");
          break;
        } else if (selectedDetRes.itemName != checkedItm.itemName || selectedDetRes.lineItemNo != checkedItm.lineItemNo || selectedDetRes.itemNo != checkedItm.itemNo) {
          prevKeyItemName = checkedItm.itemName;
          lastKeyItemName = this.checkedItemArr[this.checkedItemArr.length - 1].itemName;
          prevKeyLineItemNo = checkedItm.lineItemNo;
          lastKeyLineItemNo = this.checkedItemArr[this.checkedItemArr.length - 1].lineItemNo;
          prevKeyItemNo = checkedItm.itemNo;
          lastKeyItemNo = this.checkedItemArr[this.checkedItemArr.length - 1].itemNo;

          if (
            (prevKeyItemName != selectedDetRes.itemName && lastKeyItemName === prevKeyItemName)
            || (prevKeyLineItemNo != selectedDetRes.lineItemNo && lastKeyLineItemNo === prevKeyLineItemNo)
            || (prevKeyItemNo != selectedDetRes.itemNo && lastKeyItemNo === prevKeyItemNo)
          ) {
            this.checkedItemArr.push(selectedDetRes);
            console.log("checkedItemArr of selectedDetRes.itemCode != checkedItm.itemCode condition:::", this.checkedItemArr);
            break;
          }//end of if
        }//end of else if
      } else if (this.poType === "ZRDM" || this.poType === "ZCDM") {
        console.log(" material po");
        if (selectedDetRes.itemCode === checkedItm.itemCode && selectedDetRes.lineItemNo === checkedItm.lineItemNo) {
          console.log("item code is matched..");
          break;
        } else if (selectedDetRes.itemCode != checkedItm.itemCode || selectedDetRes.lineItemNo != checkedItm.lineItemNo) {
          prevKey = checkedItm.itemCode;
          lastKey = this.checkedItemArr[this.checkedItemArr.length - 1].itemCode;
          prevKeyLineItemNo = checkedItm.lineItemNo;
          lastKeyLineItemNo = this.checkedItemArr[this.checkedItemArr.length - 1].lineItemNo;
          if ((prevKey != selectedDetRes.itemCode && lastKey === prevKey) || (prevKeyLineItemNo != selectedDetRes.lineItemNo && lastKeyLineItemNo === prevKeyLineItemNo)) {
            this.checkedItemArr.push(selectedDetRes);
            console.log("checkedItemArr of selectedDetRes.itemCode != checkedItm.itemCode condition:::", this.checkedItemArr);
            break;
          }//end of if
        }//end of else if
      } else if (this.poType === "ZC" || this.poType === "ZR" || this.poType === "ZI") {//for pi
        //if (selectedDetRes.itemCode && selectedDetRes.packageNo) {
        if (selectedDetRes.packageNo) {
          console.log(" material po");
          if (selectedDetRes.itemCode === checkedItm.itemCode && selectedDetRes.lineItemNo === checkedItm.lineItemNo) {
            console.log("item code is matched..");
            break;
          } else if (selectedDetRes.itemCode != checkedItm.itemCode || selectedDetRes.lineItemNo != checkedItm.lineItemNo) {
            prevKey = checkedItm.itemCode;
            lastKey = this.checkedItemArr[this.checkedItemArr.length - 1].itemCode;
            prevKeyLineItemNo = checkedItm.lineItemNo;
            lastKeyLineItemNo = this.checkedItemArr[this.checkedItemArr.length - 1].lineItemNo;
            if (
              (prevKey != selectedDetRes.itemCode && lastKey === prevKey)
              || (prevKeyLineItemNo != selectedDetRes.lineItemNo && lastKeyLineItemNo === prevKeyLineItemNo)
            ) {
              this.checkedItemArr.push(selectedDetRes);
              console.log("checkedItemArr of selectedDetRes.itemCode != checkedItm.itemCode condition:::", this.checkedItemArr);
              break;
            }//end of if
          }//end of else if

        //} else if (!selectedDetRes.itemCode && !selectedDetRes.packageNo) {
        } else if (selectedDetRes.packageNo) {
          console.log(" service po");

          if (selectedDetRes.itemName === checkedItm.itemName && selectedDetRes.lineItemNo === checkedItm.lineItemNo && selectedDetRes.itemNo === checkedItm.itemNo) {
            console.log("item name, line item  no and item no are matched..");
            break;
          } else if (selectedDetRes.itemName != checkedItm.itemName || selectedDetRes.lineItemNo != checkedItm.lineItemNo || selectedDetRes.itemNo != checkedItm.itemNo) {
            prevKeyItemName = checkedItm.itemName;
            lastKeyItemName = this.checkedItemArr[this.checkedItemArr.length - 1].itemName;
            prevKeyLineItemNo = checkedItm.lineItemNo;
            lastKeyLineItemNo = this.checkedItemArr[this.checkedItemArr.length - 1].lineItemNo;
            prevKeyItemNo = checkedItm.itemNo;
            lastKeyItemNo = this.checkedItemArr[this.checkedItemArr.length - 1].itemNo;

            if (
              (prevKeyItemName != selectedDetRes.itemName && lastKeyItemName === prevKeyItemName)
              || (prevKeyLineItemNo != selectedDetRes.lineItemNo && lastKeyLineItemNo === prevKeyLineItemNo)
              || (prevKeyItemNo != selectedDetRes.itemNo && lastKeyItemNo === prevKeyItemNo)
            ) {
              this.checkedItemArr.push(selectedDetRes);
              console.log("checkedItemArr of selectedDetRes.itemCode != checkedItm.itemCode condition:::", this.checkedItemArr);
              break;
            }//end of if
          }//end of else if
        }//end of else if
      }//end of else if for potype ZC, ZR, ZI
    }//end of for
  }//end of the method

  //start method getItemDetailsws to get all item details according to the pono and vendor code
  private getItemDetailsWS(poNo: string, invoiceNo: string, vendorGstInNo: string) {
    this.busySpinner.selectedBusy = true;
    this.updateBusySpinner();
    this.debitNoteAddEditDataService.getItemDetVal(this.code, poNo, invoiceNo,vendorGstInNo).
      subscribe(res => {
        // this.itemDetails = res.details;
        this.itemsHeader = res.header;
        this.poDate = res.details[0].poDate;
        this.poDate = this.datePipe.transform(this.poDate, 'yyyy-MM-dd');
        this.poType = res.details[0].poType;
        this.poUnit = res.details[0].poUnit;
        this.orderQty = res.details[0].orderQty;
        console.log(" poType ===========>>>>>>>>>>>>>>", this.poType);
        console.log(" poUnit ===========>>>>>>>>>>>>>>", this.poUnit);
        console.log(" orderQty ===========>>>>>>>>>>>>>>", this.orderQty);
        this.headName = res.details[0].headName;
        console.log(" headName ===========>>>>>>>>>>>>>>", this.headName);
        console.log(" itemsHeader ===", this.itemsHeader);
        this.busySpinner.selectedBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log(" err ===", err);
          this.busySpinner.selectedBusy = false;
          this.updateBusySpinner();
          this.sessionErrorService.routeToLander(err._body);
        });
  }//end of method

  //method to get vendor details by vendor code
  private getVendorDetValWS(vendorCode: string) {
    console.log(" vendorCode", vendorCode);
    this.busySpinner.selectedBusy = true;
    this.updateBusySpinner();
    this.debitNoteAddEditDataService.getVendorDetVal('', vendorCode, this.division).
      subscribe(res => {
        console.log(" get vendor details ", res);
        if (res.msgType === 'Info') {
          this.vendorCodeError = false;
          let resDet = res.details[0];
          this.vendorGstInNo = resDet.vendorGstin.trim();
          this.vendorPanNo = resDet.vendorPanCardNo.trim();
          if (this.vendorGstInNo == "" && this.vendorPanNo == "") {
            this.vendorGstInNoError = true;
          }
          this.code = resDet.vendorCode;
          this.vendorName = resDet.vendorName;
          if (this.code || this.vendorName || this.vendorGstInNo || this.vendorPanNo) {
            this.vendorBoolean = true;
          }
          if (this.code && (this.vendorGstInNo || this.vendorPanNo) && this.division) {
            this.getPONosWs(this.code, this.vendorGstInNo, this.division);//calling the pono method to get po nos by vendor code
          }
          this.busySpinner.selectedBusy = false;
          this.updateBusySpinner();
        } else if (res.msgType === 'Error') {
          this.busySpinner.selectedBusy = false;
          this.updateBusySpinner();
          this.vendorCodeError = true;
          this.vendorCodeErrorDesc = "Invalid vendor code";
        }//end of else if
      },
        err => {
          console.log(" err vendor details ", err);
          this.sessionErrorService.routeToLander(err._body);
        });
  }//end of service call method

  //onOpenModal for opening modal from modalService
  private onOpenModal(invoiceTransactionNo: string) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Information';
    modalRef.componentInstance.modalMessage =
      //   this.complaintReferenceNo ?
      //     "Complaint Reference Number(DI) " + complaintRefNo + " updated successfully."
      "Debit Note Scan ID " + invoiceTransactionNo + " created successfully.";
  }
  //end of method onOpenModal

  //start method of getInvoiceNoWs to get po nos fom webservice
  private getInvoiceNoWs(code: string, poNo: string) {
    this.busySpinner.selectedBusy = true;
    this.updateBusySpinner();
    this.debitNoteAddEditDataService.getInvoiceNosVal(code, poNo).
      subscribe(res => {
        console.log(" invoice nos========>>>>>>>>>>", res);
        this.invoiceNoDropDownVal = res.details;
        for (let invNo of this.invoiceNoDropDownVal) {
          if (invNo.key === "") {
            this.invoiceAddEditFormGroup.controls["invoiceNo"].setValue(invNo.key);
            invNo.key = "-- Select --"
          }
        }
        this.busySpinner.selectedBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log("invoice err:", err);
          this.sessionErrorService.routeToLander(err._body);
          this.busySpinner.selectedBusy = false;
          this.updateBusySpinner();
        });
  }//end of the method getInvoiceNoWs



  //onOpenModal for opening modal from modalService
  public onVendorCodeSearch(vendorCode: string) {
    this.itemDetailsService.plantType = this.division;
    this.vendorGstInNoError = false;
    // this.itemDetailsService.vendorCode = this.code;
    // this.itemDetailsService.vendorGstin = this.vendorGstInNo;
    // this.itemDetailsService.vendorPanNo = this.vendorPanNo;
    // this.itemDetailsService.vendorName = this.vendorName;
    if (vendorCode) {
      vendorCode = vendorCode.toUpperCase();
      this.getVendorDetValWS(vendorCode);
    } else {
      this.router.navigate([ROUTE_PATHS.RouteVendorCodeSearch, "debitNote"]);
    }

  }
  //end of method onOpenModal

  // start method of onVendorCodeChange
  public onVendorCodeChange() {
    this.router.navigate([ROUTE_PATHS.RouteVendorCodeSearch, "debitNote"]);
  }//end of the method

  // start method onChangeInvoiceDate
  onChangeDebitNoteDate(debitNoteDateParam: string) {
    let debitNoteDate: string = debitNoteDateParam;
    this.debitNoteDateError = false;
    this.debitNoteDateErrorDesc = "";
    //formatting the current date
    let date = new Date();
    let currentDate = "";
    currentDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    debitNoteDate = this.datePipe.transform(debitNoteDate, 'yyyy-MM-dd');
    this.invoiceDate = this.datePipe.transform(this.invoiceDate, 'yyyy-MM-dd');
    if (debitNoteDate < this.invoiceDate) {
      this.debitNoteDateError = true;
      this.debitNoteDateErrorDesc = "Debit Note Date can't be less than Invoice Date!";
    }else if (debitNoteDate > currentDate) {
      console.log("fromDate Date error.")
      this.debitNoteDateError = true;
      this.debitNoteDateErrorDesc = "Debit Note Date can\'t be greater than Today's Date!";
    }//end of if
  }//end of the method onChangeInvoiceDate

  //on click cancel
  public onCancel(): void {
    this.clearInvDetService();
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }//end of onCancel click

  //method to open modal by clicking on add items
  public onAddItemOpenModal() {
    console.log(" method called");
    this.itemQtyCgstIgstError = true;
    this.itemDetailsService.selectedItemDetails = this.checkedItemArr;
    const modalRef = this.modalService.open(NgbdItemNoModalComponent);
    modalRef.componentInstance.vendorCode = this.code;
    modalRef.componentInstance.poNo = this.invoiceAddEditFormGroup.value.poNo;
    modalRef.componentInstance.invoiceNo = this.invoiceNo;
    modalRef.componentInstance.poType = this.poType;
    modalRef.componentInstance.headName = this.headName;
  }//end of the method

  //to get the file name from html 
  // public fileChangeForOtherDocs(event) {
  //   //this.reset();
  // }//end of the method to get the file name from html 

  //file upload event  
  public fileChange(event, fileTypeParam: string) {
    let flag: boolean = true;
    this.fileData = new FormData();
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      for (let i: number = 0; i < this.fileList.length; i++) {
        let file: File = this.fileList[i];
        //check file is valid
        if (!this.validateFile(file.name)) {
          if (fileTypeParam === "DR_NOTE") {
            this.invoiceFileErrFlag = true;
          } else if (fileTypeParam === "otherDocs") {
            this.otherDocFileErrFlag = true;
          }
          this.fileErrMsg = "Selected file format is not supported.Only supports .jpeg,.jpg,.png,.bmp,.pdf this file type.";
          flag = false;
        }
        if (flag) {
          if (fileTypeParam === "DR_NOTE") {
            this.invoiceFileErrFlag = false;
          } else if (fileTypeParam === "otherDocs") {
            this.otherDocFileErrFlag = false;
          }
          this.fileData.append('files' + i.toString(), file, file.name);
        }
      }//end of for
    }//end of if
  }//end of filechange method

  //to delete files
  public deleteFiles(paramValue: string, fileName: string) {
    this.formData = new FormData();//to clear the formdata
    if (confirm("Are you sure to delete " + fileName + " ?")) {
      this.fileDeleteWs(paramValue, fileName);
      // console.log("Implement delete functionality here");
    }//end of if
    if (paramValue === "invoice") {
      this.invoiceAddEditFormGroup.reset();
      this.checkedItemArr = [];
      this.selectedPONo = "";
    }
  }//end of method

  //method to remove items from the array by clicking on cross button
  public onCloseItem(checkItmDet: any) {
    let indexCount: number = 0;
    for (let chckedItm of this.checkedItemArr) {
      if (this.poType === "ZRDM" || this.poType === "ZCDM") {
        console.log(" material po");
        if (checkItmDet.itemCode === chckedItm.itemCode && checkItmDet.lineItemNo === chckedItm.lineItemNo) {
          this.checkedItemArr.splice(indexCount, 1);
          break;
        }//end of if
      } else if (this.poType === "ZRDS" || this.poType === "ZCDS") {
        console.log(" service po ");
        if (checkItmDet.itemName === chckedItm.itemName && checkItmDet.lineItemNo === chckedItm.lineItemNo && checkItmDet.itemNo === chckedItm.itemNo) {
          this.checkedItemArr.splice(indexCount, 1);
          break;
        }//end of if
      } else if (this.poType === "ZC" || this.poType === "ZR" || this.poType === "ZI") {//for pi
        // if (checkItmDet.itemCode && checkItmDet.packageNo) {
        if (!checkItmDet.packageNo) {
          console.log(" material po");
          if (checkItmDet.itemCode === chckedItm.itemCode && checkItmDet.lineItemNo === chckedItm.lineItemNo) {
            this.checkedItemArr.splice(indexCount, 1);
            break;
          }//end of if
        // } else if (checkItmDet.itemCode && !checkItmDet.packageNo) {
        } else if (checkItmDet.packageNo) {
          console.log(" service po");
          if (checkItmDet.itemName === chckedItm.itemName && checkItmDet.lineItemNo === chckedItm.lineItemNo && checkItmDet.itemNo === chckedItm.itemNo) {
            this.checkedItemArr.splice(indexCount, 1);
            break;
          }//end of if
        }//end of else if
      }//end of else if for potype ZC,ZR,ZI
      indexCount++;
    }//end of for
    this.initFormForItemList();
    this.createItemFormgroupForSelectedItem();
    this.generateTotalInvoiceDeatilsAmount();//to generate total invoice details amount
    this.getItemQtyTaxRateItemName();
    this.complaintQtyCgstSgstErrorCorrection();
  }//end of method

  //method to get items header according to pono
  public onChangePONo(poNo: string) {
    this.selectedPONo = poNo;
    this.checkedItemArr = [];
    this.totalInvoiceAmount = 0;
    this.totalCgstAmount = 0;
    this.totalSgstAmount = 0;
    this.totalIgstAmount = 0;
    this.totalAmount = 0;
    this.invoiceNo = "";
    this.itemDetailsService.selectedItemDetails = [];
    console.log(" selectedPONo ", this.selectedPONo);
    this.getInvoiceNoWs(this.code, poNo);
    //this.getItemDetailsWS(this.selectedPONo);
  }//end of method

  //method to get items header according to pono
  public onChangeInvoiceNo(args, invoiceDate: string) {
    this.invoiceNo = args.target.options[args.target.selectedIndex].text;
    this.invoiceDate = invoiceDate;
    console.log(" invoiceNo ", this.invoiceNo);
    console.log(" invoiceDate ", this.invoiceDate);
    if (this.invoiceNo != "-- Select --") {
      this.invoiceDate = this.datePipe.transform(invoiceDate, 'yyyy-MM-dd');
    }
    for (let invNo of this.invoiceNoDropDownVal) {
      if (this.invoiceNo === "-- Select --" && invNo.key === "-- Select --") {
        this.invoiceAddEditFormGroup.controls["invoiceNo"].setValue("");
        invNo.key = "-- Select --";
        invNo.value = "";
        break;
      }
    }
    if (this.invoiceNo && this.invoiceNo != "-- Select --") {
      this.getItemDetailsWS(this.selectedPONo, this.invoiceNo, this.vendorGstInNo);
    }
    console.log(" this.invoiceNoDropDownVal ", this.invoiceNoDropDownVal);
    this.checkedItemArr = [];
    this.totalInvoiceAmount = 0;
    this.totalCgstAmount = 0;
    this.totalSgstAmount = 0;
    this.totalIgstAmount = 0;
    this.totalAmount = 0;
  }//end of method

   //method to check item value
   onKeyupItemValue(itemValueParam: string, checkdItemParam: any) {
    let flag: boolean = false;
    console.log("itemQuantityParam===>", itemValueParam);
    // let cmpQtyErr : boolean = false;
    for (let checkedItm of this.checkedItemArr) {
      if (checkedItm.itemName === checkdItemParam.itemName && checkedItm.lineItemNo === checkdItemParam.lineItemNo && checkedItm.itemNo === checkdItemParam.itemNo) {
        let balanceAmount: number = parseFloat(checkdItemParam.balanceAmount);
        let itemValue: number = parseFloat(itemValueParam);
        if (itemValue > balanceAmount) {
          checkedItm.uiItemValueErrFlag = true;
          this.getItemQtyTaxRateItemName(checkedItm);
          this.complaintQtyCgstSgstErrorCorrection();
          checkedItm.uiItemValueErrDesc = 'Item Value can\'t be greater than Balance Amount.';
          this.itemValueErrFlag = true;
          break;
        } else if (isNaN(itemValue) || itemValue == 0) {
          checkedItm.uiItemValueErrFlag = true;
          this.getItemQtyTaxRateItemName(checkedItm);
          this.complaintQtyCgstSgstErrorCorrection();
          checkedItm.uiItemValueErrDesc = 'Item Value can\'t be empty or zero.';
          this.itemValueErrFlag = true;
          break;
        } else if (itemValue < 0) {
          checkedItm.uiItemValueErrFlag = true;
          this.getItemQtyTaxRateItemName(checkedItm);
          this.complaintQtyCgstSgstErrorCorrection();
          checkedItm.uiItemValueErrDesc = 'Item Value can\'t be less than zero.';
          this.itemValueErrFlag = true;
          break;
        } else if (itemValue <= balanceAmount) {
          flag = true;
          checkedItm.uiItemValueErrFlag = false;
          checkedItm.uiItemValueErrDesc = '';
          checkedItm.itemValue = itemValue;
          this.onKeyupToGenerateCgstIgstSgst(checkedItm.taxRate, checkedItm);
          //this.onKeyupToGenerateCgstIgstSgstForItemValue(checkedItm.taxRate, checkedItm);
          this.generateTotalInvoiceDeatilsAmount();
          this.getItemQtyTaxRateItemName(checkedItm);
          this.complaintQtyCgstSgstErrorCorrection();
          break;
        }//end of else if
      }//end of if
      if (flag) {//flag === true
        console.log(" flag ", flag);
        break;
      }//end of if
    }//end of for
  }//end of the method


  //start method of complaintQtyErrorCorrection
  private complaintQtyCgstSgstErrorCorrection() {
    for (let checkedItm of this.checkedItemArr) {
      let orderQtyNum: number = parseInt(this.orderQty);
      if (checkedItm.uiTaxtRateErrFlag || checkedItm.uiItemNameErrFlag || ((this.poType === 'ZRDS' || this.poType === 'ZCDS') && this.poUnit === 'JOB' && orderQtyNum === 1 && checkedItm.uiItemValueErrFlag)) {
        // if ((this.poType === 'ZRDS' || this.poType === 'ZCDS') && this.poUnit === 'JOB' && orderQtyNum === 1) {
        //   if (checkedItm.uiItemValueErrFlag) {
        //     this.itemQtyCgstIgstError = true;
        //   }
        // } else {
        this.itemQtyCgstIgstError = true;
        // }
        break;
      } else if ((checkedItm.uiTaxtRateErrFlag === false || checkedItm.uiTaxtRateErrFlag === undefined) && (checkedItm.uiItemNameErrFlag === false || checkedItm.uiItemNameErrFlag === undefined) || ((this.poType === 'ZRDS' || this.poType === 'ZCDS') && this.poUnit === 'JOB' && orderQtyNum === 1 && (checkedItm.uiItemValueErrFlag === false || checkedItm.uiItemValueErrFlag === undefined))) {
        this.itemQtyCgstIgstError = false;
        // }
      }
    }//end of for
  }//end of the method complaintQtyErrorCorrection   



  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.selectedBusy || this.busySpinner.submitBusy || this.busySpinner.fileuploadBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.selectedBusy == false && this.busySpinner.submitBusy == false && this.busySpinner.fileuploadBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  // start method to validate file extension
  private validateFile(name: String) {
    let ext: string = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'bmp' || ext.toLowerCase() == 'pdf') {
      return true;
    }//end of if
    else {
      return false;
    }//end of else
  }//end of the method

  // //start method of onKeyupToGenerateCgstIgstSgstForItemValue
  // public onKeyupToGenerateCgstIgstSgstForItemValue(taxRateParam: string, checkItmParam: any) {
  //   console.log(" substring ", this.companyGstinNo.substring(0, 2));
  //   for (let checkedItm of this.checkedItemArr) {
  //     if (checkedItm.itemName === checkItmParam.itemName && checkedItm.lineItemNo === checkItmParam.lineItemNo && checkedItm.itemNo === checkItmParam.itemNo) {
  //       let taxtRate: number = 0;
  //       taxtRate = parseFloat(taxRateParam);
  //       if (isNaN(taxtRate) || taxtRate == 0) {
  //         checkedItm.uiTaxtRateErrFlag = true;
  //         checkedItm.taxRate = 0;
  //         taxtRate = 0;
  //         checkedItm.uiTaxtRateErrDesc = 'Tax rate can’t be empty or zero.';
  //         this.complaintQtyCgstSgstErrorCorrection();
  //         let totalGST: number = (parseFloat(checkedItm.itemValue) * taxtRate) / 100;
  //         let companyGstinNoSubStr: string = this.companyGstinNo.substring(0, 2);
  //         let vendorGstInNoSubStr: string = this.vendorGstInNo.substring(0, 2);
  //         if (companyGstinNoSubStr === vendorGstInNoSubStr) {
  //           checkedItm.itemCgst = totalGST / 2;
  //           checkedItm.itemSgst = totalGST / 2;
  //           checkedItm.itemAmount = parseFloat(checkedItm.itemValue) + checkedItm.itemCgst + checkedItm.itemSgst;
  //           this.getItemQtyTaxRateItemName(checkedItm);
  //           this.complaintQtyCgstSgstErrorCorrection();
  //           break;
  //         } else {
  //           checkedItm.itemIgst = totalGST;
  //           checkedItm.itemAmount = parseFloat(checkedItm.itemValue) + checkedItm.itemIgst;
  //           this.getItemQtyTaxRateItemName(checkedItm);
  //           this.complaintQtyCgstSgstErrorCorrection();
  //           break;
  //         }
  //       } else if (taxtRate < 0) {
  //         checkedItm.taxRate = 0;
  //         taxtRate = 0;
  //         checkedItm.uiTaxtRateErrFlag = true;
  //         checkedItm.itemCgst = 0;
  //         checkedItm.itemIgst = 0;
  //         checkedItm.itemSgst = 0;
  //         checkedItm.uiTaxtRateErrDesc = 'CGST can’t be less than or equal to zero.';
  //         this.complaintQtyCgstSgstErrorCorrection();
  //         let totalGST: number = (parseFloat(checkedItm.itemValue) * taxtRate) / 100;
  //         let companyGstinNoSubStr: string = this.companyGstinNo.substring(0, 2);
  //         let vendorGstInNoSubStr: string = this.vendorGstInNo.substring(0, 2);
  //         if (companyGstinNoSubStr === vendorGstInNoSubStr) {
  //           checkedItm.itemCgst = totalGST / 2;
  //           checkedItm.itemSgst = totalGST / 2;
  //           checkedItm.itemAmount = parseFloat(checkedItm.itemValue) + checkedItm.itemCgst + checkedItm.itemSgst;
  //           this.getItemQtyTaxRateItemName(checkedItm);
  //           this.complaintQtyCgstSgstErrorCorrection();
  //           break;
  //         } else {
  //           checkedItm.itemIgst = totalGST;
  //           checkedItm.itemAmount = parseFloat(checkedItm.itemValue) + checkedItm.itemIgst;
  //           this.getItemQtyTaxRateItemName(checkedItm);
  //           this.complaintQtyCgstSgstErrorCorrection();
  //           break;
  //         }
  //       } else {
  //         // checkedItm.itemCgst = itemCgst;
  //         checkedItm.taxRate = taxtRate;
  //         checkedItm.uiTaxtRateErrFlag = false;
  //         if (checkedItm.itemName === " " || checkedItm.itemName === "") {
  //           checkedItm.uiItemNameErrFlag = "";
  //         } else if (checkedItm.itemName) {
  //           checkedItm.uiItemNameErrFlag = false;
  //         }
  //         this.complaintQtyCgstSgstErrorCorrection();
  //         let totalGST: number = (parseFloat(checkedItm.itemValue) * taxtRate) / 100;
  //         let companyGstinNoSubStr: string = this.companyGstinNo.substring(0, 2);
  //         let vendorGstInNoSubStr: string = this.vendorGstInNo.substring(0, 2);
  //         if (companyGstinNoSubStr === vendorGstInNoSubStr) {
  //           checkedItm.itemCgst = totalGST / 2;
  //           checkedItm.itemSgst = totalGST / 2;
  //           checkedItm.itemAmount = parseFloat(checkedItm.itemValue) + checkedItm.itemCgst + checkedItm.itemSgst;
  //           this.getItemQtyTaxRateItemName(checkedItm);
  //           this.complaintQtyCgstSgstErrorCorrection();
  //           break;
  //         } else {
  //           checkedItm.itemIgst = totalGST;
  //           checkedItm.itemAmount = parseFloat(checkedItm.itemValue) + checkedItm.itemIgst;
  //           this.getItemQtyTaxRateItemName(checkedItm);
  //           this.complaintQtyCgstSgstErrorCorrection();
  //           break;
  //         }//end of else
  //       }//end of else
  //     }//end of if
  //   }//end of for
  // }//end of the method


  //start method of generateCgstSgst
  private generateCgstSgst(checkedItm: any, totalGST: number, itemCgst: number, itemSgst: number, itemAmount: number) {
    itemCgst = totalGST / 2;
    itemSgst = totalGST / 2;
    checkedItm.itemSgst = Math.round(itemSgst * 100) / 100;
    checkedItm.itemCgst = Math.round(itemCgst * 100) / 100;
    itemAmount = checkedItm.itemValue + checkedItm.itemCgst + checkedItm.itemSgst;
    checkedItm.itemAmount = Math.round(itemAmount * 100) / 100;
    this.generateTotalInvoiceDeatilsAmount();
    this.getItemQtyTaxRateItemName(checkedItm);
    this.complaintQtyCgstSgstErrorCorrection();
  }//end of the method generateCgstSgst

  //start ethod of generateIgst
  private generateIgst(checkedItm: any, totalGST: number, itemIgst: number) {
    itemIgst = totalGST;
    checkedItm.itemIgst = Math.round(itemIgst * 100) / 100;
    checkedItm.itemAmount = checkedItm.itemValue + checkedItm.itemIgst;
    this.generateTotalInvoiceDeatilsAmount();
    this.getItemQtyTaxRateItemName(checkedItm);
    this.complaintQtyCgstSgstErrorCorrection();
  }//end method of generateIgst


  //start method of onKeyupToGenerateCgstIgstSgst
  public onKeyupToGenerateCgstIgstSgst(taxtRateParam: string, checkedItmParam: any) {
    this.companyGstinNo = this.localStorageService.appSettings.companyGstin;
    let companyGstinNoSubStr: string = this.companyGstinNo.substring(0, 2);
    let vendorGstInNoSubStr: string = this.vendorGstInNo.substring(0, 2);
    let totalGST: number = 0;
    let itemCgst: number = 0;
    let itemSgst: number = 0;
    let itemIgst: number = 0;
    let itemAmount: number = 0;
    console.log(" companyGstin =======", this.companyGstinNo);
    if (this.poType === "ZRDM" || this.poType === "ZCDM") {
      console.log(" material po");
      console.log(" substring ", this.companyGstinNo.substring(0, 2));
      for (let checkedItm of this.checkedItemArr) {
        if (checkedItm.itemCode === checkedItmParam.itemCode && checkedItm.lineItemNo === checkedItmParam.lineItemNo) {
          let taxtRate: number = 0;
          taxtRate = parseFloat(taxtRateParam);
          totalGST = (checkedItm.itemValue * taxtRate) / 100;
          // if (isNaN(taxtRate) || taxtRate == 0) {
          if (isNaN(taxtRate)) {
            checkedItm.uiTaxtRateErrFlag = true;
            checkedItm.taxRate = 0;
            taxtRate = 0;
            checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be empty.';
            this.complaintQtyCgstSgstErrorCorrection();
            itemCgst = 0;
            itemSgst = 0;
            itemIgst = 0;
            itemAmount = 0;
            if (companyGstinNoSubStr === vendorGstInNoSubStr) {
              this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
              break;
            } else {
              this.generateIgst(checkedItm, totalGST, itemIgst);
              break;
            }//end of else
          } else if (taxtRate < 0) {
            checkedItm.taxRate = 0;
            taxtRate = 0;
            checkedItm.uiTaxtRateErrFlag = true;
            checkedItm.itemCgst = 0;
            checkedItm.itemIgst = 0;
            checkedItm.itemSgst = 0;
            checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be less than zero.';
            this.complaintQtyCgstSgstErrorCorrection();
            itemCgst = 0;
            itemSgst = 0;
            itemIgst = 0;
            itemAmount = 0;
            if (companyGstinNoSubStr === vendorGstInNoSubStr) {
              this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
              break;
            } else {
              this.generateIgst(checkedItm, totalGST, itemIgst);
              break;
            }//end of else
          } else {
            checkedItm.taxRate = taxtRateParam;
            checkedItm.uiTaxtRateErrFlag = false;
            checkedItm.uiTaxtRateErrDesc = '';
            if (checkedItm.itemName === " " || checkedItm.itemName === "") {
              checkedItm.uiItemNameErrFlag = "";
            } else if (checkedItm.itemName) {
              checkedItm.uiItemNameErrFlag = false;
            }//end of else if
            this.complaintQtyCgstSgstErrorCorrection();
            if (this.vendorGstInNo) {
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }//end of else
            } else {
              checkedItm.itemAmount = checkedItm.itemValue;
            }//end of else
          }//end of else
        }//end of if
      }//end of for        
    } else if (this.poType === "ZRDS" || this.poType === "ZCDS") {
      console.log(" service po");
      console.log(" substring ", this.companyGstinNo.substring(0, 2));
      for (let checkedItm of this.checkedItemArr) {
        if (checkedItm.itemName === checkedItmParam.itemName && checkedItm.lineItemNo === checkedItmParam.lineItemNo && checkedItm.itemNo === checkedItmParam.itemNo) {
          // if(this.companyGstinNo.substring(0,2) === this.vendorGstInNo.substring(0,2)){
          let taxtRate: number = 0;
          taxtRate = parseFloat(taxtRateParam);
          totalGST = (checkedItm.itemValue * taxtRate) / 100;
          // if (isNaN(taxtRate) || taxtRate == 0) {
          if (isNaN(taxtRate)) {
            checkedItm.uiTaxtRateErrFlag = true;
            checkedItm.taxRate = 0;
            taxtRate = 0;
            checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be empty.';
            this.complaintQtyCgstSgstErrorCorrection();
            itemCgst = 0;
            itemSgst = 0;
            itemIgst = 0;
            itemAmount = 0;
            if (companyGstinNoSubStr === vendorGstInNoSubStr) {
              this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
              break;
            } else {
              this.generateIgst(checkedItm, totalGST, itemIgst);
              break;
            }//end od else
          } else if (taxtRate < 0) {
            checkedItm.taxRate = 0;
            taxtRate = 0;
            checkedItm.uiTaxtRateErrFlag = true;
            checkedItm.itemCgst = 0;
            checkedItm.itemIgst = 0;
            checkedItm.itemSgst = 0;
            checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be less than zero.';

            this.complaintQtyCgstSgstErrorCorrection();
            itemCgst = 0;
            itemSgst = 0;
            itemIgst = 0;
            itemAmount = 0;
            if (companyGstinNoSubStr === vendorGstInNoSubStr) {
              this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
              break;
            } else {
              this.generateIgst(checkedItm, totalGST, itemIgst);
              break;
            }//end of else
          } else {
            checkedItm.taxRate = taxtRateParam;
            checkedItm.uiTaxtRateErrFlag = false;
            if (checkedItm.itemName === " " || checkedItm.itemName === "") {
              checkedItm.uiItemNameErrFlag = "";
            } else if (checkedItm.itemName) {
              checkedItm.uiItemNameErrFlag = false;
            }
            this.complaintQtyCgstSgstErrorCorrection();
            let itemValue: number = parseFloat(checkedItm.itemValue);
            let balanceAmount: number = parseFloat(checkedItm.balanceAmount);
            if (itemValue > balanceAmount) {
              checkedItm.uiItemValueErrFlag = true;
              checkedItm.uiItemValueErrDesc = 'Item Value can\'t be greater than Balance Amount.';

              this.complaintQtyCgstSgstErrorCorrection();
            } else if (itemValue <= balanceAmount) {
              checkedItm.uiItemValueErrFlag = false;

              checkedItm.uiItemValueErrDesc = '';
              if (this.vendorGstInNo) {
                itemCgst = 0;
                itemSgst = 0;
                itemIgst = 0;
                itemAmount = 0;
                if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                  this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                  break;
                } else {
                  this.generateIgst(checkedItm, totalGST, itemIgst);
                  break;
                }
              } else {
                checkedItm.itemAmount = checkedItm.itemValue;
              }//end of else
            }//end od if
          }//end of else
        }//end of if
      }//end of for
    } else if (this.poType === "ZC" || this.poType === "ZR" || this.poType === "ZI") {//for pi
      // if (checkedItmParam.itemCode && checkedItmParam.packageNo) {
      if (!checkedItmParam.packageNo) {
        console.log(" material po");
        console.log(" substring ", this.companyGstinNo.substring(0, 2));
        for (let checkedItm of this.checkedItemArr) {
          if (checkedItm.itemCode === checkedItmParam.itemCode && checkedItm.lineItemNo === checkedItmParam.lineItemNo) {
            // if(this.companyGstinNo.substring(0,2) === this.vendorGstInNo.substring(0,2)){
            let taxtRate: number = 0;
            taxtRate = parseFloat(taxtRateParam);
            totalGST = (checkedItm.itemValue * taxtRate) / 100;
            // if (isNaN(taxtRate) || taxtRate == 0) {
            if (isNaN(taxtRate)) {
              checkedItm.uiTaxtRateErrFlag = true;
              checkedItm.taxRate = 0;
              taxtRate = 0;
              checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be empty.';

              this.complaintQtyCgstSgstErrorCorrection();
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }
            } else if (taxtRate < 0) {
              checkedItm.taxRate = 0;
              taxtRate = 0;
              checkedItm.uiTaxtRateErrFlag = true;
              checkedItm.itemCgst = 0;
              checkedItm.itemIgst = 0;
              checkedItm.itemSgst = 0;
              checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be less than zero.';

              this.complaintQtyCgstSgstErrorCorrection();
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }
            } else {
              checkedItm.taxRate = taxtRateParam;
              checkedItm.uiTaxtRateErrFlag = false;
              checkedItm.uiTaxtRateErrDesc = '';
              if (checkedItm.itemName === " " || checkedItm.itemName === "") {
                checkedItm.uiItemNameErrFlag = "";
              } else if (checkedItm.itemName) {
                checkedItm.uiItemNameErrFlag = false;
              }

              this.complaintQtyCgstSgstErrorCorrection();
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }
            }
          }//end of if
        }//end of for  
        // } else if (!checkedItmParam.itemCode && !checkedItmParam.packageNo) {
      } else if (checkedItmParam.packageNo) {
        console.log(" service po");
        this.servicePOFlag = true;
        console.log(" substring ", this.companyGstinNo.substring(0, 2));
        for (let checkedItm of this.checkedItemArr) {
          if (checkedItm.itemName === checkedItmParam.itemName && checkedItm.lineItemNo === checkedItmParam.lineItemNo && checkedItm.itemNo === checkedItmParam.itemNo) {
            // if(this.companyGstinNo.substring(0,2) === this.vendorGstInNo.substring(0,2)){
            let taxtRate: number = 0;
            taxtRate = parseFloat(taxtRateParam);
            totalGST = (checkedItm.itemValue * taxtRate) / 100;
            // if (isNaN(taxtRate) || taxtRate == 0) {
            if (isNaN(taxtRate)) {
              checkedItm.uiTaxtRateErrFlag = true;
              checkedItm.taxRate = 0;
              taxtRate = 0;
              checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be empty.';

              this.complaintQtyCgstSgstErrorCorrection();
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }
            } else if (taxtRate < 0) {
              checkedItm.taxRate = 0;
              taxtRate = 0;
              checkedItm.uiTaxtRateErrFlag = true;
              checkedItm.itemCgst = 0;
              checkedItm.itemIgst = 0;
              checkedItm.itemSgst = 0;
              checkedItm.uiTaxtRateErrDesc = 'Tax rate can\'t be less than zero.';

              this.complaintQtyCgstSgstErrorCorrection();
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }
            } else {
              checkedItm.taxRate = taxtRateParam;
              checkedItm.uiTaxtRateErrFlag = false;
              if (checkedItm.itemName === " " || checkedItm.itemName === "") {
                checkedItm.uiItemNameErrFlag = "";
              } else if (checkedItm.itemName) {
                checkedItm.uiItemNameErrFlag = false;
              }
              this.complaintQtyCgstSgstErrorCorrection();
              itemCgst = 0;
              itemSgst = 0;
              itemIgst = 0;
              itemAmount = 0;
              if (companyGstinNoSubStr === vendorGstInNoSubStr) {
                this.generateCgstSgst(checkedItm, totalGST, itemCgst, itemSgst, itemAmount);
                break;
              } else {
                this.generateIgst(checkedItm, totalGST, itemIgst);
                break;
              }
            }
          }//end of if
        }//end of for


      }//end of else if
    }//end of else if for potype ZC,ZR,ZI
    console.log(" checkedItemArr ========= ", this.checkedItemArr);
  }//end method of onKeyupToGenerateCgstIgstSgst

  //to generate total invoice  details amount
  generateTotalInvoiceDeatilsAmount() {
    this.totalInvoiceAmount = 0;
    this.totalCgstAmount = 0;
    this.totalSgstAmount = 0;
    this.totalIgstAmount = 0;
    this.totalAmount = 0;
    for (let checkedItm of this.checkedItemArr) {
      // if (checkedItm.itemValue || ((checkedItm.itemCgst && checkedItm.itemSgst) || checkedItm.itemIgst)) {
      this.totalInvoiceAmount = this.totalInvoiceAmount + parseFloat(checkedItm.itemValue);
      this.totalCgstAmount = this.totalCgstAmount + checkedItm.itemCgst;
      this.totalSgstAmount = this.totalSgstAmount + checkedItm.itemSgst;
      this.totalIgstAmount = this.totalIgstAmount + checkedItm.itemIgst;
      this.totalAmount = this.totalInvoiceAmount + this.totalCgstAmount + this.totalSgstAmount + this.totalIgstAmount;
    }//end of for
    // checking the length of the array is zero and set all total amount to zero
    if (this.checkedItemArr.length === 0) {
      this.totalInvoiceAmount = 0;
      this.totalCgstAmount = 0;
      this.totalSgstAmount = 0;
      this.totalIgstAmount = 0;
      this.totalAmount = 0;
    }//end of if
  }//end of the method

  //method to transaction submit-- invoice add
  public invoiceAddSubmit() {
    //for loop to change the item price value
    for (let itm of this.checkedItemArr) {
      itm.itemPrice = itm.netPrice;
      itm.itemQuantity = parseFloat(itm.itemQuantity);
    }//end of for
    let invoiceTranDet: any = {};
    console.log(" this.debitNoteFilesArr[0].fileName; ", this.invoiceFilesArr[0].fileName);
    invoiceTranDet.drCrNoteFileName = this.invoiceFilesArr[0].fileName;
    invoiceTranDet.vendorCode = this.code;
    invoiceTranDet.transactionType = "Debit";
    invoiceTranDet.poNumber = this.invoiceAddEditFormGroup.value.poNo;
    invoiceTranDet.invoiceNumber = this.invoiceNo;
    invoiceTranDet.drCrNoteNumber = this.invoiceAddEditFormGroup.value.debitNoteNumber;
    invoiceTranDet.drCrNoteDate = this.invoiceAddEditFormGroup.value.debitNoteDate;
    invoiceTranDet.drCrNoteAmount = this.totalInvoiceAmount;
    invoiceTranDet.totalCgst = this.totalCgstAmount;
    invoiceTranDet.totalSgst = this.totalSgstAmount;
    invoiceTranDet.totalIgst = this.totalIgstAmount;
    invoiceTranDet.totalAmount = this.totalAmount;
    invoiceTranDet.userId = this.localStorageService.user.userId;
    let items: any[] = [];
    if (this.checkedItemArr.length == 0) {
      items = [];
    } else if (this.checkedItemArr.length > 0) {
      this.checkedItemArr.forEach(addChckdItm => {
        addChckdItm.itemCgst = parseFloat(addChckdItm.itemCgst.toFixed(2));
        addChckdItm.itemSgst = parseFloat(addChckdItm.itemSgst.toFixed(2));
        addChckdItm.itemIgst = parseFloat(addChckdItm.itemIgst.toFixed(2));
        addChckdItm.itemAmount = parseFloat(addChckdItm.itemAmount.toFixed(2));
        addChckdItm.itemValue = parseFloat(addChckdItm.itemValue.toFixed(2));
        addChckdItm.uomQuantity = parseFloat(addChckdItm.uomQuantity.toFixed(3));
        addChckdItm.itemQuantity = parseFloat(addChckdItm.itemQuantity.toFixed(3));
      });
      items = this.checkedItemArr;
    }
    invoiceTranDet.items = items;
    console.log(" this.addItemDescArr ", this.addItemDescArr);
    let otherItems: any[] = [];
    if (this.addItemDescArr.length == 0) {
      otherItems = this.addItemDescArr;
    } else if (this.addItemDescArr.length > 0) {
      let otherItemEl: any = {};
      this.addItemDescArr.forEach(addItmEl => {
        otherItemEl = {};
        otherItemEl.itemDesc = addItmEl.descriptionValue;
        otherItemEl.itemReason = addItmEl.reasonValue;
        otherItemEl.itemQuantity = addItmEl.quantityValue;
        otherItemEl.itemPrice = addItmEl.rateValue;
        otherItemEl.itemAmount = parseFloat(addItmEl.amountValue);
        otherItems.push(otherItemEl);
      });
    }
    invoiceTranDet.otherItems = otherItems;
    let files: any[] = this.otherFilesArr;
    invoiceTranDet.files = files;
    let plantType: string = "";
    plantType = this.invoiceAddEditFormGroup.value.division;
    console.log("invoiceTranDet ====>>>>>> ", invoiceTranDet);
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();
    this.debitNoteAddEditDataService.transactionAddSubmit(invoiceTranDet, plantType).
      subscribe(res => {
        console.log(" res of invoice add", res);
        this.busySpinner.submitBusy = false;//to stop the busy spinner
        this.updateBusySpinner();
        if (res.msgType === "Info") {
          console.log(" success");
          this.onOpenModal(res.value);
          this.submitError = false;
          this.clearInvDetService();
          this.router.navigate([ROUTE_PATHS.RouteHome]);//route to home
        } else if (res.msgType === "Error") {
          this.submitError = true;
          this.submitErrorMsg = res.msg;
          console.log("  this.submitErrorMsg =============", this.submitErrorMsg);
        }//end of else if
      },
        err => {
          console.log("invoiceTran submit error::", err);
          this.clearInvDetService();
          this.sessionErrorService.routeToLander(err._body);
          this.busySpinner.submitBusy = false;//to stop the busy spinner
          this.updateBusySpinner();
        });
  }//end of method

  //start method of onItemNameKeyup
  public onItemNameKeyup(itemNameParam: string, itemCodeParam: string, lineItemNoParam: string, itemNoParam: string) {
    if (this.poType === "ZRDM" || this.poType === "ZCDM") {
      console.log(" material po");
      for (let checkedItm of this.checkedItemArr) {
        if (checkedItm.itemCode === itemCodeParam && checkedItm.lineItemNo === lineItemNoParam) {
          if (itemNameParam === "" || itemNameParam === " ") {
            checkedItm.uiItemNameErrFlag = true;
            checkedItm.uiItemNameErrDesc = 'Item name can’t be empty.';
            checkedItm.itemName = "";
            this.getItemQtyTaxRateItemName(checkedItm);
            this.complaintQtyCgstSgstErrorCorrection();
            // this.cgstError = true;
          } else {
            checkedItm.itemName = itemNameParam;
            checkedItm.uiItemNameErrFlag = false;
            this.getItemQtyTaxRateItemName(checkedItm);
            this.complaintQtyCgstSgstErrorCorrection();
          }//end of else
        }//end of if
      }//end of for
    } else if (this.poType === "ZRDS" || this.poType === "ZCDS") {
      console.log(" service po ");
      for (let checkedItm of this.checkedItemArr) {
        if (checkedItm.lineItemNo === lineItemNoParam && checkedItm.itemNo === itemNoParam) {
          if (itemNameParam === "" || itemNameParam === " ") {
            checkedItm.uiItemNameErrFlag = true;
            checkedItm.uiItemNameErrDesc = 'Item name can’t be empty.';
            checkedItm.itemName = "";
            this.getItemQtyTaxRateItemName(checkedItm);
            this.complaintQtyCgstSgstErrorCorrection();
            // this.cgstError = true;
          } else {
            checkedItm.itemName = itemNameParam;
            checkedItm.uiItemNameErrFlag = false;
            this.getItemQtyTaxRateItemName(checkedItm);
            this.complaintQtyCgstSgstErrorCorrection();
          }//end of else
        }//end of if
      }//end of for
    }//end of else if potype === FO zs
  }//end of the method onItemNameKeyup

  // start method deleteResErrorMsgOnClick to remove the error messege
  public deleteResErrorMsgOnClick(errorParam: string) {
    if (errorParam === 'invoice') {
      this.invoiceFileSubmitError = false;
    } else if (errorParam === 'other') {
      this.otherFileSubmitError = false;
    } else if (errorParam === 'submit') {
      this.submitError = false;
    }//end of else if
  }//end of the method

  //to download file
  public onClickForFileDownload(val: any) {
    console.log("clicked value : ", val);
    this.fileDownloadService.downloadFile(val).
      subscribe(res => {
        console.log("onClickForFileDownload: ", res);

        if (res.msgType === 'Info') {
          let byteCharacters = atob(res.valueSub);
          let byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          let byteArray = new Uint8Array(byteNumbers);
          let blob = new Blob([byteArray], { "type": "application/octet-stream" });

          if (navigator.msSaveBlob) {
            let fileName = res.value;
            navigator.msSaveBlob(blob, fileName);
          } else {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = res.value;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }//end else
        }

        this.busySpinner.secQuesdropdownBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log(err);
          this.sessionErrorService.routeToLander(err._body);
          this.busySpinner.secQuesdropdownBusy = false;
          this.updateBusySpinner();
        });

  }//end of method onClickForFileDownload

  // to change unit dropdown value 17.09.18
  public onItemUnitChanges(checkItmParam: any) {
    console.log(" checkItmParam === ", checkItmParam);
    let qty: number = 0;
    let convQty: number = 0;
    let hsnCode: number = 0;
    let convUnit: string = "";
    let itemDesc: string = "";
    let itemValue: number = 0;
    this.checkedItemArr.forEach(checkItm => {
      if (checkItm.slNo == checkItmParam.slNo) {

        convQty = 0;
        convUnit = "";
        for (let itmList in this.itemListFormGroup.value) {
          let arr: string[] = itmList.split('_');
          console.log(" arr ==== ", arr);
          if (arr.length == 2) {
            if (arr[0] == checkItmParam.slNo) {
              console.log(" slno mateched ");
              if (arr[1] == "convQty") {
                convQty = this.itemListFormGroup.controls[itmList].value;
                if (convQty == 0 || convQty < 0 || convQty == null) {
                  checkItm.uiConvQtyErrFlag = true;
                  if (convQty == 0 || convQty == null) {
                    checkItm.uiConvQtyErDesc = 'Quantity can\'t be zero or empty';
                  } else if (convQty < 0) {
                    checkItm.uiConvQtyErDesc = 'Quantity can\'t be less than or equal to zero';
                  }
                } else {
                  checkItm.uiConvQtyErrFlag = false;
                  checkItm.uiConvQtyErDesc = '';
                }//end of else
                console.log(" got value convQty == ", convQty);
              } else if (arr[1] == "convUnit") {
                convUnit = this.itemListFormGroup.controls[itmList].value;
                if (!convUnit.trim()) {
                  checkItm.uiConvUnitErrFlag = true;
                  checkItm.uiConvUnitErrDesc = 'Please select any Conv. Unit';
                } else {
                  checkItm.uiConvUnitErrFlag = false;
                  checkItm.uiConvUnitErrDesc = '';
                }
                console.log(" got value convUnit == ", convUnit);
              } else if (arr[1] == "itemDesc") {
                itemDesc = this.itemListFormGroup.controls[itmList].value;
                if (!itemDesc.trim()) {
                  checkItm.uiItemNameErrFlag = true;
                  checkItm.uiItemNameErrDesc = 'Item name can\'t be empty';
                } else {
                  checkItm.uiItemNameErrFlag = false;
                  checkItm.uiItemNameErrDesc = '';
                }//end of else
                console.log(" got value itemDesc == ", itemDesc);
              } else if (arr[1] == "hsnCode") {
                hsnCode = this.itemListFormGroup.controls[itmList].value.trim();
                console.log(" got value hsnCode == ", hsnCode);
                checkItm.hsnCode = hsnCode;
              }
              // else if(arr[1] == "itemValue") {
              //   itemValue = parseFloat(this.itemListFormGroup.controls[itmList].value.trim());
              //   console.log(" got value itemValue == ", itemValue);
              //   checkItm.itemValue = itemValue;
              // }
            }//end if of slno and controlname 1st element  
          }//end if of length to splited array
        }//end of  for loop of itemListFormGroup

        //old qty check
        // if (qty <= 0) {
        //   if (convQty > 0 && convUnit.trim() && itemDesc.trim()) {
        //     checkItmParam.conversion.forEach(convElement => {
        //       if (checkItmParam.itemCode == convElement.itemCode
        //         && convUnit == convElement.itemUnit
        //         && convUnit != convElement.baseUnit) {
        //         qty = (convQty * convElement.numerator) / convElement.denominator;
        //         console.log("qty===== ", qty);
        //         qty = Math.round(qty * 1000) / 1000;
        //         console.log("qty after ===== ", qty);
        //       }//end if
        //     });//end of forEach
        //   }//end if
        // }//end if
        // end of old qty check

        //new qty check
        if (qty <= 0) {
          if (convQty > 0 && convUnit.trim() && itemDesc.trim()) {
            for(let convElement of checkItmParam.conversion){

              if (convUnit == convElement.itemUnit && checkItmParam.itemCode == convElement.itemCode){
                if (convUnit != this.poUnit){				
                    if(convUnit != convElement.baseUnit ){//&& !qtyCheckFlag){
                      qty = (convQty * convElement.numerator) / convElement.denominator;
                      console.log("qty===== ", qty);
                      qty = Math.round(qty * 1000) / 1000;
                      console.log("qty after ===== ", qty);							
                    }else{
                      qty = convQty;
                      console.log("qty===== ", qty);
                      qty = Math.round(qty * 1000) / 1000;
                      console.log("qty after ===== ", qty);						
                    }
                  }	else{
                    qty = convQty;
                    console.log("qty===== ", qty);
                    qty = Math.round(qty * 1000) / 1000;
                    console.log("qty after ===== ", qty);
                  }	
                  break;		
              }else{
               qty = 0;			
              }              
            };//end of for
          }//end if
        }//end if
        //end of new qty check

      }//end if of slno check between checkedItemArr element and checked item param element
    });//end of for each loop of checkedItemArr 


    if (qty == 0 && convQty >= 0) {
      qty = convQty;
    }
    checkItmParam.itemQuantity = qty;
    checkItmParam.uomQuantity = convQty;
    checkItmParam.itemName = itemDesc;
    checkItmParam.itemUom = convUnit.trim();
    //calling item amount method
    let itemPrice: number = parseFloat(checkItmParam.netPrice);
    let balanceAmount: number = parseFloat(checkItmParam.balanceAmount);
    if (qty >= 0 && convUnit.trim()) {
      itemValue = itemPrice * qty;
      itemValue = Math.round(itemValue * 100) / 100;
      if (itemValue > balanceAmount) {
        checkItmParam.itemValue = itemPrice * qty;
        checkItmParam.uiItemValueErrFlag = true;
        checkItmParam.uiItemValueErrDesc = 'Item Value can\'t be greater than Balance Amount.';
      } else if (itemValue <= balanceAmount) {
        checkItmParam.itemValue = itemPrice * qty;
        checkItmParam.uiItemValueErrFlag = false;
        checkItmParam.uiItemValueErrDesc = '';
        this.onKeyupToGenerateCgstIgstSgst(checkItmParam.taxRate, checkItmParam);
        this.generateTotalInvoiceDeatilsAmount();
        this.getItemQtyTaxRateItemName(checkItmParam);
        this.complaintQtyCgstSgstErrorCorrection();
      }
    }

    console.log(" checkedItemArr == ", this.checkedItemArr);
  }//end of the method 17.09.18




  //method to change any value for item desc grid 15.11.18
  public onItemDescElementChanges(ItmParam: any) {
    let desc: string = "";
    let reason: string = "";
    let qty: number = 0;
    let rate: number = 0;
    let amount: number = 0;
    this.addItemDescArr.forEach(addItemDescEl => {
      if (addItemDescEl.slno === ItmParam.slno) {
        console.log(" ====slno matched====");
        for (let itmDescFrm in this.itemDescListFormGroup.value) {
          console.log(" formvalue == ", itmDescFrm);
          let arr: string[] = itmDescFrm.split('_');
          if (arr.length == 2) {
            if (arr[0] == ItmParam.slno) {
              console.log(" slno mateched ");
              if (arr[1] == "description") {
                desc = this.itemDescListFormGroup.controls[itmDescFrm].value;
                if (!desc.trim()) {
                  addItemDescEl.uiItemDescGridDescErrFlag = true;
                  addItemDescEl.descriptionValue = '';
                  addItemDescEl.uiItemDescGridDescErrDesc = 'Description can\'t be empty';
                } else {
                  addItemDescEl.uiItemDescGridDescErrFlag = false;
                  addItemDescEl.uiItemDescGridDescErrDesc = '';
                  addItemDescEl.descriptionValue = desc;
                }//end of else
                console.log("description value::: ", desc);
              } else if (arr[1] == "reason") {
                reason = this.itemDescListFormGroup.controls[itmDescFrm].value;
                if (!reason.trim()) {
                  addItemDescEl.uiItemDescGridReasonErrFlag = true;
                  addItemDescEl.reasonValue = '';
                  addItemDescEl.uiItemDescGridReasonErrDesc = 'Reason can\'t be empty';
                } else {
                  addItemDescEl.uiItemDescGridReasonErrFlag = false;
                  addItemDescEl.uiItemDescGridReasonErrDesc = '';
                  addItemDescEl.reasonValue = reason;
                }//end of else
                console.log("reason value::: ", reason);
              } else if (arr[1] == "quantity") {
                qty = this.itemDescListFormGroup.controls[itmDescFrm].value;
                if (qty > 0) {
                  addItemDescEl.quantityValue = qty;
                  //   addItemDescEl.amountValue = qty * addItemDescEl.rateValue;
                  // amount = qty * addItemDescEl.rateValue;
                }
                console.log("quantity value::: ", qty);
              } else if (arr[1] == "rate") {
                rate = this.itemDescListFormGroup.controls[itmDescFrm].value;
                if (rate > 0) {
                  addItemDescEl.rateValue = rate;
                  //   addItemDescEl.amountValue = addItemDescEl.quantityValue * rate;
                  //   amount = addItemDescEl.quantityValue * rate;
                }
                console.log("rate value::: ", rate);
              } else if (arr[1] == "amount") {
                amount = this.itemDescListFormGroup.controls[itmDescFrm].value;
                if (amount == 0 || amount < 0 || amount == null) {

                  addItemDescEl.uiItemDescGridAmountErrFlag = true;
                  if (amount == 0 || amount == null) {
                    addItemDescEl.amountValue = amount;
                    addItemDescEl.uiItemDescGridAmountErrDesc = 'Amount can\'t be zero or empty';
                  } else if (amount < 0) {
                    addItemDescEl.amountValue = amount;
                    addItemDescEl.uiItemDescGridAmountErrDesc = 'Amount can\'t be less than or equal to zero';
                  }//end of else if
                } else {
                  addItemDescEl.uiItemDescGridAmountErrFlag = false;
                  addItemDescEl.uiItemDescGridAmountErrDesc = '';
                  addItemDescEl.amountValue = amount;
                }//end of else
                console.log("amount value::: ", amount);
              }//end of else if
            }//end of if for slno check
          }//end of if for length check
        }//end of for loop for form group
      }//end of if slno check
    });//end of foreach
  }//end of the method 15.11.18

  //method to remove items from the array by clicking on cross button 15.11.18
  public onCloseItemDescElement(itmDetParam: any) {
    let indexCount: number = 0;
    for (let addItmEl of this.addItemDescArr) {
      if (addItmEl.slno === itmDetParam.slno) {
        this.addItemDescArr.splice(indexCount, 1);
        break;
      }//end of if
      indexCount++;
    }//end of for
  }//end of method 15.11.18


  //to create formgroup for selected item 17.09.18
  private createItemDescFormgroupForSelectedItem() {
    //creating an object for formgroup
    let itmFrmgroup: any = {};
    // iterating checkedItemArr to push the hardcoded conversion json and creationg dynamic formcontro
    // creating key
    let key = this.addItemDescArr.length + 1;
    let descriptionKey = key + "_" + "description";
    let reasonKey = key + "_" + "reason";
    let quantityKey = key + "_" + "quantity";
    let rateKey = key + "_" + "rate";
    let amountKey = key + "_" + "amount";

    let createdItemDesc: any = {};

    //creating dynamic formcontrol
    createdItemDesc.slno = key;
    createdItemDesc.descriptionKey = descriptionKey;
    createdItemDesc.descriptionValue = '';
    createdItemDesc.reasonKey = reasonKey;
    createdItemDesc.reasonValue = '';
    createdItemDesc.quantityKey = quantityKey;
    createdItemDesc.quantityValue = 0;
    createdItemDesc.rateKey = rateKey;
    createdItemDesc.rateValue = 0;
    createdItemDesc.amountKey = amountKey;
    createdItemDesc.amountValue = 0;
    this.addItemDescArr.push(createdItemDesc);
    this.addItemDescArr.forEach(addLtmEl => {
      itmFrmgroup[addLtmEl.descriptionKey] = new FormControl(addLtmEl.descriptionValue, Validators.required);
      itmFrmgroup[addLtmEl.reasonKey] = new FormControl(addLtmEl.reasonValue, Validators.required);
      itmFrmgroup[addLtmEl.quantityKey] = new FormControl(addLtmEl.quantityValue);
      itmFrmgroup[addLtmEl.rateKey] = new FormControl(addLtmEl.rateValue);
      itmFrmgroup[addLtmEl.amountKey] = new FormControl(addLtmEl.amountValue, Validators.required);
      //creating formgroup
      this.itemDescListFormGroup = new FormGroup(itmFrmgroup);
    });

    console.log("this.addItemDescArr====", this.addItemDescArr);
  }//end of the method 17.09.18



  //start method onAddItemDescGrid
  public onAddItemDescGrid() {
    this.createItemDescFormgroupForSelectedItem();
  }//end method of onAddItemDescGrid


  // methods for division and division modal
  //start method onDivisionChange 15.11.18
  public onDivisionChange() {
    this.modalFormGroup.controls['divisionM'].setValue(this.division);
    this.toggleCommSettModalBtn();
  } //end method onDivisionChange 15.11.18

  //start method onDivisionChange 15.11.18
  public onDivisionChoose() {
    console.log(" division", this.division);
    this.division='DI';
   // this.toggleCommSettModalBtn();
   this.onConfirmDivisionModal('Y');
  } //end method onDivisionChange 15.11.18

  public divisionSetFlag: boolean = false;
  private toggleCommSettModalBtn() {
    this.divisionSetFlag = this.divisionSetFlag ? false : true;
  }

  onConfirmDivisionModal(btnVal) {
    if (btnVal === 'Y') {
      //this.division = this.invoiceAddEditFormGroup.value.division;
      if (this.userType === 'V') {
        // if (this.code && this.division && (this.vendorGstInNo || this.vendorPanNo)) {
        //   this.getPONosWs(this.code, this.vendorGstInNo, this.division);
        // }//end of if
        this.getUserType();//get user type from localstorage 
      }//end of if
    } else {
      this.invoiceAddEditFormGroup.controls['division'].setValue('');//to reset the control value
      this.division = this.invoiceAddEditFormGroup.value.division;
    }
    this.toggleCommSettModalBtn();
  }


  onChangeDivisionModal(btnVal) {
    if (btnVal === 'Y') {
      if (this.invoiceAddEditFormGroup.value.division != this.modalFormGroup.value.divisionM) {
        this.itemDetailsService.plantType = this.modalFormGroup.value.divisionM;
        this.division = this.modalFormGroup.value.divisionM;
        this.itemDetailsService.vendorCode = "";
        this.itemDetailsService.vendorName = "";
        this.itemDetailsService.vendorGstin = "";
        this.itemDetailsService.vendorPanNo = "";
        this.code = "";
        this.vendorBoolean = false;
        this.vendorGstInNo = "";
        this.vendorName = "";
        this.vendorPanNo = "";
        this.selectedPONo = "";
        this.invoiceNo = "";
        this.invoiceDate = "";
        this.poDate = "";
        this.headName = "";
        this.invoiceNoDropDownVal = [];
        this.invoiceFilesArr = [];
        this.poNoDropDownVal = [];
        this.otherFilesArr = [];
        this.addItemDescArr = [];
        this.checkedItemArr = [];
        this.totalInvoiceAmount = 0;
        this.totalCgstAmount = 0;
        this.totalSgstAmount = 0;
        this.totalIgstAmount = 0;
        this.totalAmount = 0;
        this.vendorGstInNoError = false;
        //clear all value
        this.initform();
        this.initFormForItemList();
        this.getSelectedDescValWs();//calling method to get desc for other doc from webservice
        this.getUserType();//get user type from localstorage 
      }
    }
    this.toggleCommSettModalBtn();
  }
  //end of commercial settlement

  public cancelModal() {
    if (this.division == "") {
      this.invoiceAddEditFormGroup.controls['division'].setValue('');//to reset the control value
    }
    this.toggleCommSettModalBtn();
  }

  // end methods for division and division modal


}//end of class
