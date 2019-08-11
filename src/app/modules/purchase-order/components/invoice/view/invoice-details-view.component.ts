import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { PurchaseInvoiceItemViewDataService } from "../../../services/purchase-invoice-item-view-data.services";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { PurchaseOrderInteractionService } from "../../../services/purchase-order-interaction.service";
import { FileDownloadService } from "../../../../shared/services/file-download.service";

@Component({
  selector: 'ispl-invoice-details-view',
  templateUrl: 'invoice-details-view.component.html',
  styleUrls: ['invoice-details-view.component.css']
})

export class InvoiceDetailsViewComponent implements OnInit {

  // private poStatusWithFilterStr: string;//store po status from route param
  private filterStatusObj: any = {};//store converted data
  private setInvFilterFlag: boolean = false;//taking a var to set filter according to boolean value
  private invDateQuery: string = "";//taking var to store inv query
  private uploadinvDateQuery: string = "";//taking var to store upload inv query
  private filterObjQuery: string = "";//taking a var to store filter object query
  private ponoQuery: string = "";//taking a var to store localstorage value of po number
  //taking var to change date format
  private fromDT: string;
  private toDT: string;
  private uploadfromDT: string;
  private uploadtoDT: string;
  private currentDate: string;//for sysdate
  
  // for checking fromDate and toDate error
  public fromDateErr: boolean = false;
  public toDateErr: boolean = false;
  public uploadfromDateErr: boolean = false;
  public uploadtoDateErr: boolean = false;
  
  public invoiceViewDetails: any = {}//to show the complaint det in html page
  public invoicedetailsViewHeader: any = {};//to show header in html page
  public poNo: string;//for modify complaint id
  public poDate: string;//to showing po date 
  public poType: string//to show poType

  public facetedDataDetails: any[] = [];//to show faceted data in html
  public switchCheckboxVal: Boolean = false;//to store switch checkbox value
  public uploadswitchCheckboxVal: Boolean = false;//to store uploadswitch checkbox value
  
  public switchInputCheck: Boolean = false;//to check uncheck switch button
  public uploadswitchInputCheck: Boolean = false;//to check uncheck switch button
  public anyValue: string = "";//to stored details search value 19.02.19
  public serverSearchArr: any[] = [];//to store  serach values 19.02.19

  //for sorting and orderType activity id parameters
  public sortSelection: any = {
    sortData: 'Invoice Uploaded On',
    orderType: 'DESC',
    facetedArray: [],
    prevFilter: '',
    filter: '',
    callingFromFacet: ''
  };
  public searchFormGroup: FormGroup;
  //checkbox
  public checkAll: boolean = false;
  public otherCheck: boolean = false;

  //taking var for filter
  public filterOption: string = "";
  //taking var for previous filter
  public previousFilter: string = '';
  //taking any array for faceted
  public facetedArray: any[] = [];
  //for error msg
  public errMsgShowFlag: boolean = false;//to show the error msg div
  public errorMsg: string;//to store the error msg
  //for busy spinner
  public busySpinner: any = {
    gridBusy: true,
    facetedNavBusy: true,
    busy: true
  };
  public title: string = "Invoice Details View";//page title
  public invoiceDetailsFormGroup: FormGroup;//taking formgroup type var
  public iconarr: string[] = [];//taking a array to show step icons in table
  public userType: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,//route parameter
    private localStorageService: LocalStorageService,
    private purchaseInvoiceItemViewDataService: PurchaseInvoiceItemViewDataService,
    private sessionErrorService: SessionErrorService,
    private purchaseOrderInteractionService: PurchaseOrderInteractionService,
    private datePipe: DatePipe,//for date
    private fileDownloadService: FileDownloadService
  ) {
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit InvoiceViewComponent Class");
    this.buildForm();//calling the method to create formcontrol
    this.getSystemDate();//calling the method to get system date
    this.getRouteParam();//to get route param
    this.setInvFilterFlag = true;//set true to set the query 
    this.setFilterFromPOInteractionService();//calling the method to set filter from po interaction service
    this.busySpinner.busy = false;
    this.invoiceDetViewWSCall();//get po details web service call
    this.userType = this.localStorageService.user.userType;
  }//end of onInit

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.gridBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.gridBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  private getRouteParam() {
  //method to get route param
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.poNo = params.pono ? params.pono : '';
      let poStatus = params.postatus ? params.postatus : '';
    });
    this.ponoQuery =
      this.localStorageService.appSettings.dbFields.poNumber + "= '" + this.poNo + "'";
  }//end of method

  //a method named buildform for creating the invoiceDetailsFormGroup and its formControl
  private buildForm(): void {
    this.invoiceDetailsFormGroup = this.formBuilder.group({
      'fromDate': [''
      ],
      'toDate': [''
      ],
      'uploadfromDate': [''
      ],
      'uploadtoDate': [''
      ]
    });
  }//end of method buildForm

  //method to get system date
  private getSystemDate(){
    //formatting the current date
    let date = new Date();
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.invoiceDetailsFormGroup.controls["fromDate"].setValue(this.currentDate);
    this.invoiceDetailsFormGroup.controls["toDate"].setValue(this.currentDate);
    this.invoiceDetailsFormGroup.controls["uploadfromDate"].setValue(this.currentDate);
    this.invoiceDetailsFormGroup.controls["uploadtoDate"].setValue(this.currentDate);
  }//end of method


  //method to set filter from PO interaction service
  private setFilterFromPOInteractionService() {
    console.log("if setInvFilterFlag is true.........");
    console.log("this.purchaseOrderInteractionService.poWSFilter:::",this.purchaseOrderInteractionService.poWSFilter);
    let sortselectionFilter: string = "";
    let serviceInteractionFilter: any = this.purchaseOrderInteractionService.poWSFilter;
    let comingFromParam: string = serviceInteractionFilter.comingFrom;
    console.log("coming from param::",comingFromParam);
    if(comingFromParam === "poview"){
      this.filterStatusObj.prevFilter = serviceInteractionFilter.prevFilter;
      this.filterStatusObj.filter = serviceInteractionFilter.filter;
      this.filterStatusObj.callingFromFacet = serviceInteractionFilter.callingFromFacet;
      let facetedArray: any[] = [];
      let farr: any[] = serviceInteractionFilter.facetedArray;
      if(farr) {
        for(let pofacetarrel of farr) {
          facetedArray.push(pofacetarrel);
        }
      }    
      this.filterStatusObj.facetedArray = facetedArray;
      //store podate query
      let poDateQuery:string = serviceInteractionFilter.poDateQuery;
      if(poDateQuery){
        this.filterStatusObj.poDateQuery = poDateQuery;
      }//end of if
      //new add-22-02-19
      //store serverSearchQuery query
      let serverSearchQuery: string = serviceInteractionFilter.serverSearchQuery;
      if(serverSearchQuery){
        this.filterStatusObj.serverSearchQuery = serverSearchQuery;
      }//end of if
      this.anyValue = serviceInteractionFilter.anyValue;//to store deataled search value
      this.serverSearchArr = serviceInteractionFilter.serverSearchArr;//to store deataled search value
      this.purchaseOrderInteractionService.filterData = "Stored";

      //store po filter opion
      let pofilteroptionquery:string = serviceInteractionFilter.pofilteroptionquery;
      if(pofilteroptionquery){
        this.filterStatusObj.pofilteroptionquery = pofilteroptionquery;
      }//end of if

    }//end of if
    console.log("this.filterStatusObj in setFilterFromPOInteractionService method::",this.filterStatusObj);   

    //creating the filter according the postatus
    if (this.poNo) {
      if (this.filterStatusObj.filter) {
        sortselectionFilter = " AND " + this.filterStatusObj.filter;
        this.filterObjQuery = sortselectionFilter;
      }
    }//end of if

    this.sortSelection.prevFilter = this.filterStatusObj.prevFilter;
    this.sortSelection.callingFromFacet = this.filterStatusObj.callingFromFacet;  
    let facetedArr: any[] = this.filterStatusObj.facetedArray;
    // push faceted array
    if (facetedArr) {
      this.facetedArray = facetedArr;
    }//end of if
  }//end of method
  
  //method to set current filter object to po interaction service filter
  private setFilterToPOInteractionService(callingfor: string) {
    let poStatusFilterObj: any = {};
    //set the obj element to an object and send it through service
    poStatusFilterObj.filter = this.sortSelection.filter;
    poStatusFilterObj.prevFilter = this.sortSelection.prevFilter;
    let facetedArr:any[] = this.sortSelection.facetedArray;
    poStatusFilterObj.facetedArray = facetedArr;
    poStatusFilterObj.callingFromFacet = this.sortSelection.callingFromFacet;


    poStatusFilterObj.ponoQuery = this.ponoQuery;

    //store podate query
    let poDateQuery:string = this.filterStatusObj.poDateQuery;
    if(poDateQuery){
      poStatusFilterObj.poDateQuery = poDateQuery;
    }else{
      poStatusFilterObj.poDateQuery = "";
    }

    if(this.invDateQuery){
      let invDateQuery =  this.invDateQuery;
      poStatusFilterObj.invDateQuery = invDateQuery;
    }else{
      poStatusFilterObj.invDateQuery = "";
    }

    if(this.uploadinvDateQuery){
      let uploadinvDateQuery =  this.uploadinvDateQuery;
      poStatusFilterObj.uploadinvDateQuery = uploadinvDateQuery;
    }else{
      poStatusFilterObj.uploadinvDateQuery = "";
    }
    
    if(this.filterOption){
      let filterOptnQuery: string =  " AND "+ this.filterOption;
      poStatusFilterObj.invfilteroptionquery = filterOptnQuery;
    }else{
      if(this.filterStatusObj.pofilteroptionquery){
        poStatusFilterObj.invfilteroptionquery = this.filterStatusObj.pofilteroptionquery;
      }else{
        poStatusFilterObj.invfilteroptionquery = '';
      }
    }

    console.log("poStatusFilterObj::::", poStatusFilterObj);
    this.purchaseOrderInteractionService.wsFilter = poStatusFilterObj;
    if(callingfor === "creditNote") {
      poStatusFilterObj.comingFromParam = "invview";
      this.purchaseOrderInteractionService.invoiceWSFilter = poStatusFilterObj;
    }
    console.log("this.purchaseOrderInteractionService.wsFilter::::", this.purchaseOrderInteractionService.wsFilter);
  }//end of method
  
  //creating a method to build query
  private buildQuery() {
    let finalQuery: string = "";
    let filterOptn: string = "";
    let poDtQuery: string = this.filterStatusObj.poDateQuery;
      if(poDtQuery == '' || poDtQuery == undefined) {
        poDtQuery = "";
      }
    let serverSearchQuery: string  = this.filterStatusObj.serverSearchQuery;
    if(serverSearchQuery =='' || serverSearchQuery == undefined){
      serverSearchQuery = "";
    }
    if (this.filterOption) {
      filterOptn = " AND " + this.filterOption;  
      // finalQuery = this.ponoQuery + poDtQuery + filterOptn + this.invDateQuery  + this.uploadinvDateQuery;
    }else{
      filterOptn = this.filterStatusObj.pofilteroptionquery;
      if(filterOptn == '' || filterOptn == undefined){
        filterOptn = '';
      }
      // finalQuery = this.ponoQuery + poDtQuery + filterOptn + this.invDateQuery  + this.uploadinvDateQuery;
    }//end of else

    finalQuery = this.ponoQuery + poDtQuery + serverSearchQuery + filterOptn + this.invDateQuery  + this.uploadinvDateQuery;

    
    console.log("finalQuery:::::", finalQuery);
    this.sortSelection.filter = finalQuery;
    this.setInvFilterFlag = false;//set the flag false
  }//end of method
  
  //method to get po details by web service
  private invoiceDetViewWSCall() {
    this.busySpinner.gridBusy = true;
    this.updateBusySpinner();//to load spinner
    this.buildQuery();//calling the method to build query
    let facetedArr: any[] = this.facetedArray;//set faceted array to jsonbody
    this.sortSelection.facetedArray = facetedArr;
    console.log("sortselection of invoice det:::", this.sortSelection);
    this.purchaseInvoiceItemViewDataService.getInvoiceDetViewWithFacet(this.sortSelection).
      subscribe(res => {
        console.log("invoice View Details : ", res);
        this.invoicedetailsViewHeader = res.header;
        // console.log("header........", this.invoicedetailsViewHeader);
        let facetedDetailsObj: any = {};//taking var to store invoice details from response
        //checking msg type is info or not
        if (res.msgType === "Info") {
          this.invoiceViewDetails = res;
          facetedDetailsObj = res.nav;
          this.facetedDataDetails = facetedDetailsObj.facetedNav;
          this.sortSelection.prevFilter = facetedDetailsObj.prevFilter;
          //itrate response details array to store total
          let totalInvoiceStatus: number = this.invoiceViewDetails.details[0].totalInvoiceStatus;//taking a var to store the totalInvoiceStatus
          this.iconarr = [];//clear the array
          //to push element to iconarr totalInvoiceStatus times 
          // for (let i = 0; i < totalInvoiceStatus; i++) {
          //   this.iconarr.push("chandler");
          // }//end of for
          this.iconarr.push("joey");
          this.iconarr.push("chandler");
          this.iconarr.push("rachel");
          this.iconarr.push("pheobe");
          this.iconarr.push("ross");
          this.iconarr.push("monica");

          this.poDate = this.invoiceViewDetails.details[0].poDate;
          this.poType = this.invoiceViewDetails.details[0].poType;

          this.errMsgShowFlag = false;//set false to hide the err msg in html page
        } else {
          this.facetedDataDetails = [];//clear the array
          this.invoiceViewDetails = {};//clear the obj
          this.errMsgShowFlag = true;
          this.errorMsg = res.msg;
          this.invoiceViewDetails.processStartDateTime = res.processStartDateTime;
        }
        this.busySpinner.gridBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log(err);
          this.sessionErrorService.routeToLander(err._body);
          // show error msg on html page
          this.errMsgShowFlag = true;
          this.errorMsg = err.msg;
          this.facetedDataDetails = [];//clear the array
          this.invoiceViewDetails = {};//clear the obj
          this.busySpinner.gridBusy = false;
          this.updateBusySpinner();
          this.invoiceViewDetails.processStartDateTime = err.processStartDateTime;
        });
  }//end of method  

  //method to create query with date field
  private onClickInvDatesButton(fromDate, toDate) {//MMM-dd-yyyy   
    let frmDT: string = "";
    let toDT: string= "";
    console.log("this.switchCheckboxVal:::::", this.switchCheckboxVal);
    this.fromDT = fromDate;
    this.toDT = toDate;
    if (fromDate) {
      frmDT = this.datePipe.transform(fromDate, 'dd-MMM-yyyy');
    }
    if (toDate) {
      toDT = this.datePipe.transform(toDate, 'dd-MMM-yyyy');
    }
    console.log("fromDate::", this.fromDT + " toDate::", this.toDT);
    let invDTQuery: string = "";
    if (this.switchCheckboxVal) {//checking if switchcheckbox is true or false the build the query
      if (fromDate && toDate) {
        //set query according to dates
        invDTQuery = " AND " +
        this.localStorageService.appSettings.dbFields.invoiceDate + 
        " BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(frmDT, 'dd/MM/yyyy') + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(toDT, 'dd/MM/yyyy') + " 23:59:59\',103)";
          // frmDT + " 00:00:01' AND '" + toDT + " 23:59:59'";
          // this.fromDT + " 00:00:01' AND '" + this.toDT + " 23:59:59'";


          this.invDateQuery = invDTQuery;
        console.log("invoice Date Query:: ", this.invDateQuery);
      }
    } else {
      this.invDateQuery = "";
    }//end of switchcheckbox check       
  }//end of method  
  
   //method to create query with date field
    private onClickuploadDatesButton(uploadfromDate, uploadtoDate) {//MMM-dd-yyyy   
    let uploadfrmDT: string = "";
    let uploadtoDT: string= "";
    console.log("this.uploadswitchCheckboxVal:::::", this.uploadswitchCheckboxVal);
    this.uploadfromDT = uploadfromDate;
    this.uploadtoDT = uploadtoDate;
    if (uploadfromDate) {
      uploadfrmDT = this.datePipe.transform(uploadfromDate, 'dd-MMM-yyyy');
    }
    if (uploadtoDate) {
      uploadtoDT = this.datePipe.transform(uploadtoDate, 'dd-MMM-yyyy');
    }
    console.log("uploadfromDate::", this.uploadfromDT + " uploadtoDate::", this.uploadtoDT);
    let uploadinvDTQuery: string = "";
    if (this.uploadswitchCheckboxVal) {//checking if switchcheckbox is true or false the build the query
      if (uploadfromDate && uploadtoDate) {
        //set query according to dates
        uploadinvDTQuery = " AND " +
        this.localStorageService.appSettings.dbFields.invoiceMakerDateTime + 
        " BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(uploadfrmDT, 'dd/MM/yyyy') + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(uploadtoDT, 'dd/MM/yyyy') + " 23:59:59\',103)";
        // uploadfrmDT + " 00:00:01' AND '" + uploadtoDT + " 23:59:59'";
         
          // this.fromDT + " 00:00:01' AND '" + this.toDT + " 23:59:59'";

          this.uploadinvDateQuery = uploadinvDTQuery;
        console.log("upload invoice Date Query:: ", this.uploadinvDateQuery);
      }
    } else {
      this.uploadinvDateQuery = "";
    }//end of switchcheckbox check       
  }//end of method
  
  //method to filter date button
  public onClickDatesButton(fromDate,toDate,uploadfromDate,uploadtoDate) {
    if(this.switchCheckboxVal) {
      this.onClickInvDatesButton(fromDate, toDate);
    }else{
      this.invDateQuery = "";
    }
    if(this.uploadswitchCheckboxVal) {
      this.onClickuploadDatesButton(uploadfromDate, uploadtoDate);
    }else{
      this.uploadinvDateQuery = "";
    }
    this.invoiceDetViewWSCall();//calling the method to get data
  }//end of method

  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  public onClick(val) {
    console.log("clicked value : " + val);
    // if (this.sortSelection.sortData == val) {
    //   this.sortSelection.orderType = "DESC";
    // } else {
    //   this.sortSelection.orderType = "ASC";
    // }
    if(this.sortSelection.orderType && this.sortSelection.orderType === "ASC"){
      this.sortSelection.orderType = "DESC";
    }else if(this.sortSelection.orderType && this.sortSelection.orderType === "DESC"){
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.invoiceDetViewWSCall();
  }//end of onclick method

  
  //method to get filter value
  public onClickFilter(header: string, checkedValue: string, checkedBoolean: Boolean) {
    console.log("checkedHeader: ", header);
    console.log("checkedValue: ", checkedValue);
    console.log("checkedBoolean: ", checkedBoolean);    
    //checking the length of selectedData by clicking on checkbox
    if (this.facetedArray.length == 0) {
      //push complaintDetail obj to selectedData array
      this.facetedArray.push({ facetedGrp: header, facetedData: checkedValue });
      console.log("invoice det view facetedArray : ", this.facetedArray);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let selectedData of this.facetedArray) {
        if (selectedData.facetedData == checkedValue) {
          this.facetedArray.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("invoice det view facetedArray data after deleting: ", this.facetedArray);
      if (!removeFlag) {
        this.facetedArray.push({ facetedGrp: header, facetedData: checkedValue });
      }//end of if
      console.log("invoice det view facetedArray after pushing: ", this.facetedArray);
    }//end of else    
    // let facetQuery: string = '';//for faceted query
    console.log("facetedArray: ", this.facetedArray);
    if (this.facetedArray && this.facetedArray.length > 0) {
      let facetTree: any = {};
      for (let facetNode of this.facetedArray) {
        let facetQuery: string = '';
        if (facetTree[facetNode.facetedGrp]) {
          facetQuery += facetTree[facetNode.facetedGrp] + ' OR ';
          facetQuery += facetNode.facetedGrp + '=' + '\'' + facetNode.facetedData + '\'';
        } else {
          facetQuery = facetNode.facetedGrp + '=' + '\'' + facetNode.facetedData + '\'';
        }
        facetTree[facetNode.facetedGrp] = facetQuery;
      }      
      let facetQryString: string = '';
      if (facetTree) {
        for (let facetNodeIndex in facetTree) {
          facetQryString ? facetQryString += ' AND ' : null;
          facetQryString += facetTree[facetNodeIndex];
        }
      }
      console.log('facetTree: ', facetTree);
      console.log('facetQuery: ', facetQryString);
      this.filterOption = facetQryString;
      //end of if arr length check
    } else {
      this.filterOption = '';
    }
    console.log("facetQuery for filter : ", this.filterOption);    
    //check the checkboolean is true or false then set the header to the obj
    if (checkedBoolean == true) {
      this.sortSelection.callingFromFacet = '';
    } else if (checkedBoolean == false) {
      this.sortSelection.callingFromFacet = header;
    }
    console.log("this.sortselection after filteration....", this.sortSelection);
    this.busySpinner.gridBusy = true;//busy spinner
    this.busySpinner.facetedNavBusy = true;//busy spinner
    this.updateBusySpinner();
    this.invoiceDetViewWSCall();//view grid data && facet data
  } //end of method to get filter value
    
  //method to get switch button value 
  public onClickSwitchButton(switchBtnCheckedVal) {
    console.log("clicked checked value of switch button::::", switchBtnCheckedVal);
    this.switchCheckboxVal = !this.switchCheckboxVal;
    console.log("this.switchCheckboxVal:::::", this.switchCheckboxVal);
  }//end of method  
  
  //method for Complaint Logged On and Compliant Reference Date validation 
  public compareTwoDates(controlName: string, fromDateval: string, toDateval: string) {
    this.fromDateErr = false;
    this.toDateErr = false;
    console.log("fromDateval::", fromDateval + " toDateval:::", toDateval);
    fromDateval = this.datePipe.transform(fromDateval, 'yyyy-MM-dd');
    toDateval = this.datePipe.transform(toDateval, 'yyyy-MM-dd');
    console.log("transformed --->> fromDateval::", fromDateval + " toDateval:::", toDateval);
    if (fromDateval && toDateval) {
      if (controlName === 'fromDate') {
        if ((new Date(fromDateval) > new Date(toDateval))) {
          console.log("fromDate Date error.")
          this.fromDateErr = true;
          this.toDateErr = false;
        }//end of if
      } else if (controlName === 'toDate') {
        if ((new Date(toDateval) < new Date(fromDateval))) {
          console.log("toDate Date error.")
          this.toDateErr = true;
          this.fromDateErr = false;
        }//end of if
      }//end of else if
    }//end of date value check
  }//end of method
  
  //method to get uploadswitchCheckboxVal button value 
  public onClickUploadSwitchButton(uploadswitchBtnCheckedVal) {
    console.log("clicked checked value of uploadswitch button::::", uploadswitchBtnCheckedVal);
    this.uploadswitchCheckboxVal = !this.uploadswitchCheckboxVal;
    console.log("this.uploadswitchCheckboxVal:::::", this.uploadswitchCheckboxVal);
  }//end of method
  
  //method for Complaint Logged On and Compliant Reference Date validation 
  public uploadcompareTwoDates(controlName: string, uploadfromDateval: string, uploadtoDateval: string) {
    this.uploadfromDateErr = false;
    this.uploadtoDateErr = false;
    console.log("uploadfromDateval::", uploadfromDateval + " uploadtoDateval:::", uploadtoDateval);
    uploadfromDateval = this.datePipe.transform(uploadfromDateval, 'yyyy-MM-dd');
    uploadtoDateval = this.datePipe.transform(uploadtoDateval, 'yyyy-MM-dd');
    console.log("transformed --->> uploadfromDateval::", uploadfromDateval + " uploadtoDateval:::", uploadtoDateval);
    if (uploadfromDateval && uploadtoDateval) {
      if (controlName === 'uploadfromDate') {
        if ((new Date(uploadfromDateval) > new Date(uploadtoDateval))) {
          console.log("uploadfromDate Date error.")
          this.uploadfromDateErr = true;
          this.uploadtoDateErr = false;
        }//end of if
      } else if (controlName === 'uploadtoDate') {
        if ((new Date(uploadtoDateval) < new Date(uploadfromDateval))) {
          console.log("uploadtoDate Date error.")
          this.uploadtoDateErr = true;
          this.uploadfromDateErr = false;
        }//end of if
      }//end of else if
    }//end of date value check
  }//end of method
  
  //method to open invoice details page by clicking on po number
  public onClickTransactionNumber(transactionNumber: string, invoiceStatusQuery: string) {
    console.log("selected transactionNumber::::", transactionNumber);
    console.log("selected invoiceStatusQuery::::", invoiceStatusQuery);
    this.setFilterToPOInteractionService("invItem");//calling the method to set filter object to po interaction service
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteInvoiceItemDetView, transactionNumber, invoiceStatusQuery]);
  }//end of method
  
  //method to route credit note details page by clicking on total credit note number
  public onClickTotalCreditNoteNumber(totalCreditNote: string, invoiceNumber: string){
    console.log("totalCreditNote no:::",totalCreditNote+" Invoice No::",invoiceNumber);
    this.setFilterToPOInteractionService("creditNote");//calling the method to set filter object to po interaction service
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteCreditNoteDetView, invoiceNumber, totalCreditNote]);
    
  }//end of method

  //method to route credit note details page by clicking on total credit note number
  public onClickTotalDebitNoteNumber(totalDebitNote: string, invoiceNumber: string){
    console.log("totalDebitNote no:::",totalDebitNote+" Invoice No::",invoiceNumber);
    this.setFilterToPOInteractionService("creditNote");//calling the method to set filter object to po interaction service
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteDebitNoteDetView, invoiceNumber, totalDebitNote]);
    
  }//end of method
  
  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    this.errMsgShowFlag = false;//to hide the error msg div
  }//method to delete error msg

    //to download po file
    public onClickForFileDownload(val: any) {
      console.log("clicked value : " , val);
      this.fileDownloadService.downloadFile(val).
        subscribe(res => {
          console.log("onClickForFileDownload: ", res);
  
          if(res.msgType === 'Info'){
            let byteCharacters = atob(res.valueSub);
            let byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
  
            let byteArray = new Uint8Array(byteNumbers);
            let blob = new Blob([byteArray], {"type": "application/octet-stream"});
  
            if(navigator.msSaveBlob){
                let fileName = res.value;
                navigator.msSaveBlob(blob, fileName);
            } else {
                let link = document.createElement("a");
                link.href =  URL.createObjectURL(blob);
                link.setAttribute('visibility','hidden');
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
}//end of class
