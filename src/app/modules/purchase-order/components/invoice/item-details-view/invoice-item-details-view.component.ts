import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { PurchaseInvoiceItemViewDataService } from "../../../services/purchase-invoice-item-view-data.services";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { PurchaseOrderInteractionService } from "../../../services/purchase-order-interaction.service";

@Component({
  selector: 'ispl-invoice-item-details-view',
  templateUrl: 'invoice-item-details-view.component.html',
  styleUrls: ['invoice-item-details-view.component.css']
})
export class InvoiceItemDetailsViewComponent implements OnInit {

  private statusQuery: string;//store po status from route param
  private filterStatusObj: any = {};//store converted data
  private setInvFilterFlag: boolean = true;//taking a var to set filter according to boolean value
  private transactionNumber: string;//to store transaction number

  //taking a var to store localstorage value of invoice number
  private invoicenoQuery: string = "";
  
  public poNo: string = "";//to store po number from response
  public poDate: string = "";//to store po date 
  // public vendorName: string = "";//to store vendor name
  // public vendorGstinNO: string = "";//to store vendor gstin no
  
  public invoiceNo: string= "";//to store invoice no from response
  public invoiceDate: string = "";//to store invoice date from response
  public invoiceItemViewDetails: any = {};//to show the complaint det in html page
  public itemHeaderDetails: any = {};//to how item header

  public facetedDataDetails: any[] = [];//to show faceted data in html

  //for sorting and orderType activity id parameters
  public sortSelection: any = {
    sortData: '',
    orderType: '',
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
  public filterOption: string = '';
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
  public title: string = "Item Details View";
  //complaint register var to check complaint is registered or not in html
  public complaintLoggedActivityId: number = this.localStorageService.appSettings.complaintRegistrationActivityId;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,//route parameter
    private localStorageService: LocalStorageService,
    private purchaseInvoiceItemViewDataService: PurchaseInvoiceItemViewDataService,
    private sessionErrorService: SessionErrorService,
    private purchaseOrderInteractionService: PurchaseOrderInteractionService
  ) {
    console.log(" Class");
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit invoice item ViewComponent Class");
    this.busySpinner.busy = false;
    this.getRouteParam();//to get route param
    this.setFilterFromPOInteractionService();//calling the method to set filter from po interaction service
    this.invoiceItemDetViewWSCall();
  }//end of onInit

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.gridBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.gridBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.transactionNumber = params.transactionnumber ? params.transactionnumber : '';
      this.statusQuery = params.invoicestatus ? params.invoicestatus : '';
    });
    this.invoicenoQuery =
      this.localStorageService.appSettings.dbFields.transactionNumber + "= '" + this.transactionNumber + "'";
  }//end of method

  //method to set filter from PO interaction service
  private setFilterFromPOInteractionService() {
    console.log("if setInvFilterFlag is true.........");
    let sortselectionFilter: string = "";
    let serviceInteractionFilter: any = this.purchaseOrderInteractionService.wsFilter;

    this.filterStatusObj.prevFilter = serviceInteractionFilter.prevFilter;
    this.filterStatusObj.filter = serviceInteractionFilter.filter;
    this.filterStatusObj.callingFromFacet = serviceInteractionFilter.callingFromFacet;
    this.filterStatusObj.facetedArray = serviceInteractionFilter.facetedArray;

    //creating the filter according the postatus
    if (this.transactionNumber) {
      if (this.filterStatusObj.filter) {
        sortselectionFilter = this.invoicenoQuery + " AND " + this.filterStatusObj.filter;
      } else {
        sortselectionFilter = this.invoicenoQuery;
      }
    }//end of if

    this.sortSelection.filter = sortselectionFilter;
    this.sortSelection.prevFilter = this.filterStatusObj.prevFilter;
    this.sortSelection.callingFromFacet = this.filterStatusObj.callingFromFacet;
    // this.sortSelection.facetedArray = this.filterStatusObj.facetedArray;

    let checkBoolean: Boolean = false;
    let facetedArr: any[] = this.filterStatusObj.facetedArray;
    // push faceted array
    if (facetedArr) {
      this.facetedArray = facetedArr;
    }//end of if
    this.setInvFilterFlag = false;//set the flag false
  }//end of method

  //method to get po details by web service
  private invoiceItemDetViewWSCall() {
    this.busySpinner.gridBusy = true;
    this.updateBusySpinner();//to load spinner

    
    this.sortSelection.facetedArray = this.facetedArray;//set faceted array to jsonbody

    console.log("sortselection of invoice item det:::", this.sortSelection);
    this.purchaseInvoiceItemViewDataService.getInvoiceItemDetViewWithFacet(this.sortSelection).
      subscribe(res => {
        console.log("invoice item View Details : ", res);
        this.itemHeaderDetails = res.header;
        //checking msg type is info or not
        if (res.msgType === "Info") {
          this.invoiceItemViewDetails = res;
          let facetedDetailsArr = res.nav;
          this.facetedDataDetails = facetedDetailsArr.facetedNav;
          // this.sortSelection.prevFilter = facetedDetailsObj.prevFilter;//store prevfilter from invoice item det
          this.errMsgShowFlag = false;//set false to hide the err msg in html page

          //to store po number from response
            this.poNo = this.invoiceItemViewDetails.details[0].poNumber;
            this.poDate = this.invoiceItemViewDetails.details[0].poDate;
            this.invoiceNo = this.invoiceItemViewDetails.details[0].invoiceNumber;
            this.invoiceDate = this.invoiceItemViewDetails.details[0].invoiceDate;        
        } else {
          // show error msg on html page
          this.errMsgShowFlag = true;
          this.errorMsg = res.msg;
          this.invoiceItemViewDetails.processStartDateTime = res.processStartDateTime;
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
          this.busySpinner.gridBusy = false;
          this.updateBusySpinner();
          this.invoiceItemViewDetails.processStartDateTime = err.processStartDateTime;
        });
  }//end of method

  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  public onClicktTableHeader(val) {
    console.log("clicked value : " + val);
    if (this.sortSelection.sortData == val) {
      this.sortSelection.orderType = "DESC";
    } else {
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.invoiceItemDetViewWSCall();
  }//end of onclick method


  //method to route from breadcrumb
  public onClickBreadcrumbLink() {
    let postatus: string = "";//taking var for route parameter
    this.purchaseOrderInteractionService.poWSFilter.comingFrom = "poview";
    // console.log("present class filter:::::",this.sortSelection);
    // console.log("wsFilter for invoice details page::",this.purchaseOrderInteractionService.wsFilter);
    this.router.navigate([ROUTE_PATHS.RouteInvoiceDetView, this.poNo, postatus]);
  }//end of method

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick() {
    this.errMsgShowFlag = false;//to hide the error msg div
  }//method to delete error msg

}//end of class
