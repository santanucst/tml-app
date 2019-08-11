import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { Router, ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { PurchaseInvoiceItemViewDataService } from "../../services/purchase-invoice-item-view-data.services";
import { SessionErrorService } from "../../../shared/services/session-error.service";
import { PurchaseOrderInteractionService } from "../../services/purchase-order-interaction.service";
import { FileDownloadService } from "../../../shared/services/file-download.service";
import { PurchaseOrderHeaderParamModel } from "../../models/purchase-order-header-param.model";
import { PurchaseOrderHeaderColumnNameModel } from "../../models/purchase-order-header-column-name.model";
@Component({
  selector: 'ispl-purchase-order-details-view',
  templateUrl: 'purchase-order-details-view.component.html',
  styleUrls: ['purchase-order-details-view.component.css']
})
export class PurchaseOrderDetailsViewComponent implements OnInit {

  private purchaseOrderHeaderTableFieldNames: any = {};//to get header table column names

  //taking var to change date format
  private fromDT: string;
  private toDT: string;
  private currentDate: string;//for sysdate
  private poDateQuery: string = "";//taking var to store inv query
  private serverSearchQuery: string = "";//taking var to store server search query
  private serverSearchUrl: string = "";//taking var to store server search query
  private finalUrl: string = "";
  private usertype: string = this.localStorageService.user.userType;
  private poUserTypeCheckBoolean: Boolean = false;//taking var to check user type once

  public poViewDetails: any = {}//to show the complaint det in html page
  public podetailsViewHeader: any = {};//to show header in html page
  public poNo: string;//for modify complaint id
  public facetedDataDetails: any[] = [];//to show faceted data in html

  // for checking fromDate and toDate error
  public fromDateErr: boolean = false;
  public toDateErr: boolean = false;
  public switchCheckboxVal: Boolean = false;//to store switch checkbox value
  public switchInputCheck: Boolean = false;//to check uncheck switch button
  //for sorting and orderType activity id parameters
  public sortSelection: any = {
    sortData: '',
    orderType: '',
    facetedArray: [],
    prevFilter: '',
    filter: '',
    callingFromFacet: ''
  };
  //takin arr for selectedData
  public selectedData: any[] = [];
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
  public title: string = "Purchase Order View";
  public poDetailsFormGroup: FormGroup;//taking formgroup type var

  public headerparams: PurchaseOrderHeaderParamModel;
  public pager: any = {};
  public datacount: number = 0;

  //server search formgroup
  public serverSearchModalFormGroup: FormGroup;
  public fromDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,//route parameter
    private cd: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private purchaseInvoiceItemViewDataService: PurchaseInvoiceItemViewDataService,
    private sessionErrorService: SessionErrorService,
    private purchaseOrderInteractionService: PurchaseOrderInteractionService,
    private datePipe: DatePipe,//for date
    private fileDownloadService: FileDownloadService
  ) {
    console.log(" Class");
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
    //serverSearchModalFormGroup
    let serverSearchFormGroup: any = {}
    serverSearchFormGroup['anyTypeSearch'] = new FormControl();
    serverSearchFormGroup['poNumber'] = new FormControl();
    serverSearchFormGroup['vendorName'] = new FormControl();
    this.serverSearchModalFormGroup = new FormGroup(serverSearchFormGroup);
    this.initform();
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit PurchaseOrderViewComponent Class");
    this.headerparams = new PurchaseOrderHeaderParamModel();//add this model on onInit method
    this.purchaseOrderHeaderTableFieldNames = new PurchaseOrderHeaderColumnNameModel().purchaseOrderHeaderTableFieldNames;
    console.log("this.purchaseOrderInteractionService.filterData=====>>>>>>>>>", this.purchaseOrderInteractionService.filterData)
    if (!this.purchaseOrderInteractionService.filterData) {
      this.clearPrevFilter();
    }
    this.getSystemDate();//calling the method to get system date
    this.busySpinner.busy = true;
    this.setFilterToSortSelectionObjByUserType();//to set filter to sort selection obj according to userType
    //this.poDetViewWSCall();//get po details web service 
    this.setPrevDetailedSearch();
    this.setPagination();
  }//end of onInit

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.gridBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.gridBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method


  /**
 * @description init form data
 */
  initform() {
    this.poDetailsFormGroup = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl('')
    });
  }
  //method to get system date
  private getSystemDate() {
    //formatting the current date
    let date = new Date();
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.poDetailsFormGroup.controls["fromDate"].setValue(this.currentDate);
    this.poDetailsFormGroup.controls["toDate"].setValue(this.currentDate);
  }//end of method

  //method to set sort selection filter according to usertype
  private setFilterToSortSelectionObjByUserType() {
    // let filterObj: any = {};
    if (this.usertype === "V") {
      // this.sortSelection.filter =
      //   this.localStorageService.appSettings.dbFields.vendorName + "= '"
      //   + this.localStorageService.user.name + "' AND "
      //   + this.localStorageService.appSettings.dbFields.vendorGstin + "= '"
      //   + this.localStorageService.user.vendorGstin + "'";

      //set calling from facet to the sort selection filter
      this.sortSelection.callingFromFacet = this.localStorageService.appSettings.dbFields.vendorName;

      this.sortSelection.prevFilter =
        "'" + this.localStorageService.user.code + "';'"
        + this.localStorageService.user.vendorGstin + "'";

      let localFacetedArr: any[] = [];
      localFacetedArr.push({ facetedGrp: this.localStorageService.appSettings.dbFields.vendorGstin, facetedData: this.localStorageService.user.vendorGstin });
      localFacetedArr.push({ facetedGrp: this.localStorageService.appSettings.dbFields.vendorName, facetedData: this.localStorageService.user.name });
      this.facetedArray = localFacetedArr;
    } else if (this.usertype === "E") {
      this.sortSelection.filter = "";
    }//end of else if
    this.poUserTypeCheckBoolean = true;//set true 

  }//end of method

  // start method of setPrevDetailedSearch
  private setPrevDetailedSearch() {
    let poDatequr: string = "";
    if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.poDateQuery) {
      poDatequr = this.purchaseOrderInteractionService.poWSFilter.poDateQuery.trim();
      this.poDateQuery = poDatequr.substring(4, poDatequr.length).trim();
      console.log(" poDateQuery === ", this.poDateQuery);
      if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.fromDT) {
        this.fromDT = this.purchaseOrderInteractionService.poWSFilter.fromDT;
      }
      if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.toDT) {
        this.toDT = this.purchaseOrderInteractionService.poWSFilter.toDT;
      }
      this.poDetailsFormGroup.controls["fromDate"].setValue(this.datePipe.transform(this.fromDT.trim(), 'yyyy-MM-dd'));
      this.poDetailsFormGroup.controls["toDate"].setValue(this.datePipe.transform(this.toDT.trim(), 'yyyy-MM-dd'));
      this.switchCheckboxVal = true;
    }//end date query check 28.02.18
    let serverSearchqur: string = "";
    //added for serverSearchQuery 19.02.19
    if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.serverSearchQuery) {
      serverSearchqur = this.purchaseOrderInteractionService.poWSFilter.serverSearchQuery.trim();
      this.serverSearchQuery = serverSearchqur.substring(4, serverSearchqur.length);
    }
    if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.serverSearchUrl) {
      this.serverSearchUrl = this.purchaseOrderInteractionService.poWSFilter.serverSearchUrl;
      console.log(" this.serverSearchUrl ", this.serverSearchUrl);
    }

    if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.anyValue) {
      this.anyValue = this.purchaseOrderInteractionService.poWSFilter.anyValue;
      console.log(" this.anyValue ", this.anyValue);
    }

    if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.anyValue) {
      this.anyValue = this.purchaseOrderInteractionService.poWSFilter.anyValue;
      console.log(" this.anyValue ", this.anyValue);
      this.serverSearchModalFormGroup.controls['anyTypeSearch'].setValue(this.anyValue);
    } else if (this.purchaseOrderInteractionService.poWSFilter && this.purchaseOrderInteractionService.poWSFilter.serverSearchArr) {
      let serverSearchArrTemp: any[] = this.purchaseOrderInteractionService.poWSFilter.serverSearchArr;
      serverSearchArrTemp.forEach(serverSearchEl => {
        this.serverSearchArr.push(serverSearchEl);
      });

      this.serverSearchArr.forEach(srvrsrchArrEl => {
        if (srvrsrchArrEl.dbColName == 'PO_NMBR') {
          this.serverSearchModalFormGroup.controls['poNumber'].setValue(srvrsrchArrEl.value);
        } else if (srvrsrchArrEl.dbColName == 'VEND_NAME') {
          this.serverSearchModalFormGroup.controls['vendorName'].setValue(srvrsrchArrEl.value);
        }
      });//end of for each loop

    }//end of else if
  }//end of the method setPrevDetailedSearch 22.02.19

  //start method of set filter
  private setFilter() {
    let filter: string = "";//taking var to 
    let filterUrl: string = "";
    this.finalUrl = "";

    if (this.filterOption) {
      filter = this.filterOption;
      if (filter.includes("&")) {
        filterUrl = filter.replace("&", "~");
      } else {
        filterUrl = filter;
      }
      if (this.poDateQuery || this.serverSearchQuery) {
        if (this.poDateQuery) {
          this.sortSelection.filter = filter + " AND " + this.poDateQuery;
          this.finalUrl = filterUrl + " AND " + this.poDateQuery;
        }
        if (this.serverSearchQuery) {
          this.sortSelection.filter = this.sortSelection.filter ? this.sortSelection.filter + " AND " + this.serverSearchQuery : filter + " AND " + this.serverSearchQuery;
          if (this.finalUrl) {
            this.finalUrl = this.finalUrl + " AND " + this.serverSearchUrl;
          } else {
            this.finalUrl = filterUrl + " AND " + this.serverSearchUrl;
          }
        }
      } else {
        this.sortSelection.filter = filter;
        this.finalUrl = filterUrl;
      }
    } else {
      if (this.poDateQuery || this.serverSearchQuery) {
        if (this.poDateQuery) {
          filter = this.poDateQuery;
          this.sortSelection.filter = filter;
          this.finalUrl = filter;
        }
        if (this.serverSearchQuery) {
          if (filter) {
            this.sortSelection.filter = filter + " AND " + this.serverSearchQuery;
            this.finalUrl = filter + " AND " + this.serverSearchUrl;
          } else {
            this.sortSelection.filter = this.serverSearchQuery;
            this.finalUrl = this.serverSearchUrl;
          }//end of else
        } else {
          this.sortSelection.filter = filter;
          this.finalUrl = filter;
        }//end of else
      }
    }//end of else

    if (this.usertype === "V") {
      let vendorQuery: string = "";
      if (!this.filterOption) {
        vendorQuery = this.localStorageService.appSettings.dbFields.vendorName + "= '"
          + this.localStorageService.user.name + "' AND "
          + this.localStorageService.appSettings.dbFields.vendorGstin + "= '"
          + this.localStorageService.user.vendorGstin + "'";
      }

      if (this.sortSelection.filter) {
        let filterQuery: string = "";
        if (vendorQuery) {
          filterQuery = this.sortSelection.filter + ' AND ' + vendorQuery;
          this.finalUrl = this.finalUrl + ' AND ' + vendorQuery;
        } else {
          filterQuery = this.sortSelection.filter;
        }
        this.sortSelection.filter = filterQuery;
      } else if (!this.sortSelection.filter) {
        if (vendorQuery) {
          this.sortSelection.filter = vendorQuery;
          this.finalUrl = vendorQuery;
        } else {
          this.sortSelection.filter = '';
          // this.finalUrl = '';
        }
      }
    }//end if if userType == v
    if (!this.sortSelection.sortData && !this.sortSelection.orderType) {
      this.sortSelection.sortData = "Total Invoice";
      this.sortSelection.orderType = "DESC";
    }
  }//end method of set filter

  // start method clearPrevFilter
  private clearPrevFilter() {
    let poWSFilterLoc: any = {};
    poWSFilterLoc.poDateQuery = "";
    poWSFilterLoc.serverSearchQuery = "";
    poWSFilterLoc.fromDT = "";
    poWSFilterLoc.toDT = "";
    poWSFilterLoc.serverSearchUrl = "";
    poWSFilterLoc.anyValue = "";
    poWSFilterLoc.serverSearchArr = [];
    this.purchaseOrderInteractionService.poWSFilter = poWSFilterLoc;
  }//end method of clearPrevFilter

  //method to get po details by web service
  private poDetViewWSCall() {
    this.errMsgShowFlag = false;
    this.busySpinner.gridBusy = true;
    this.updateBusySpinner();//to load spinner
    this.setFilter();
    this.sortSelection.facetedArray = this.facetedArray;//set faceted array to jsonbody
    this.purchaseInvoiceItemViewDataService.getPODetViewWithFacet(this.sortSelection, this.headerparams).
      subscribe(res => {
        console.log("po View Details : ", res);
        this.podetailsViewHeader = res.header;
        //checking msg type is info or not
        if (res.msgType === "Info") {
          this.poViewDetails = res;
          let facetedDetailsObj = res.nav;
          this.facetedDataDetails = facetedDetailsObj.facetedNav;
          this.sortSelection.prevFilter = facetedDetailsObj.prevFilter;
          console.log(" poViewDetails.details === ", this.poViewDetails.details.length);
          // if(this.datacount == 0){
          //   this.setPagination();
          // }
        } else {
          this.poViewDetails = {};
          this.facetedDataDetails = [];
          // show error msg on html page
          this.errMsgShowFlag = true;
          this.errorMsg = res.msg;
          this.poViewDetails.processStartDateTime = res.processStartDateTime;
        }
        // if(this.datacount > 0){
        this.sortSelection.filter = '';
        this.busySpinner.gridBusy = false;
        this.updateBusySpinner();
        // }
      },
        err => {
          console.log(err);
          this.sessionErrorService.routeToLander(err._body);
          this.poViewDetails = {};
          this.facetedDataDetails = [];
          // show error msg on html page
          this.errMsgShowFlag = true;
          this.errorMsg = err.msg;
          this.poViewDetails.processStartDateTime = err.processStartDateTime;
          // if(this.datacount > 0){
          this.sortSelection.filter = '';
          this.busySpinner.gridBusy = false;
          this.updateBusySpinner();
          // }
        });
  }//end of method

  //start method setPagination
  private setPagination() {
    this.busySpinner.gridBusy = true;
    let searchUrl: string = '';
    // if(this.serverSearchUrl){
    //   searchUrl = this.serverSearchUrl;
    // }else {
    this.setFilter();
    searchUrl = this.finalUrl;
    // }
    this.purchaseInvoiceItemViewDataService.getHeadercount(searchUrl).subscribe((res) => {
      console.log(res);
      this.datacount = res.xCount;
      this.sortSelection.filter = '';
      this.setPage(1);
    }, (err) => {
      console.log(err);
      this.sortSelection.filter = '';
    })
  }//end of the method setPagination

  private getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    let remainder = Math.ceil(totalItems % pageSize);


    console.log("totalPages after = ", totalPages);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }



  /**
   * 
   * @param page 
   * @param term 
   */
  public setPage(page: number) {
    // get current page of items this is for local paginate

    console.log(" data count:", this.datacount);
    this.pager = this.getPager(this.datacount, page, 10);
    // this.getlistofschoole(this.pager.currentPage - 1, 10);

    this.headerparams.pageNo = (this.pager.currentPage > 0 ? (this.pager.currentPage - 1) : this.pager.currentPage).toString();
    this.headerparams.perPage = '10';
    this.poDetViewWSCall();
    this.cd.detectChanges();

    //use to do for local pagination
    // this.pagedItems = this.allschooldata.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }



  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  public onClickForSortSelection(val) {
    console.log("clicked value : " + val); 
    if(this.sortSelection.sortData == val && this.sortSelection.orderType == "DESC"){
      this.sortSelection.orderType = "ASC";
    }else if(this.sortSelection.sortData == val && this.sortSelection.orderType == "ASC"){
      this.sortSelection.orderType = "DESC";
    }//end of else if
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.poDetViewWSCall();
    this.selectedData = [];//removing the array 
  }//end of onclick method


  //method to get filter value
  public onClickFilter(header: string, checkedValue: string, checkedBoolean: Boolean) {
    this.selectedData = [];//removing the array 
    console.log("checkedHeader: ", header);
    console.log("checkedValue: ", checkedValue);
    console.log("checkedBoolean: ", checkedBoolean);

    //checking the length of selectedData by clicking on checkbox
    if (this.facetedArray.length == 0) {
      //push complaintDetail obj to selectedData array
      this.facetedArray.push({ facetedGrp: header, facetedData: checkedValue });
      console.log("Purchase Order Details view facetedArray : ", this.facetedArray);
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
      console.log("Purchase Order Details view facetedArray data after deleting: ", this.facetedArray);
      if (!removeFlag) {
        this.facetedArray.push({ facetedGrp: header, facetedData: checkedValue });
      }//end of if
      console.log("Purchase Order Details view facetedArray after pushing: ", this.facetedArray);
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
    this.setPagination();
    this.poDetViewWSCall();//view grid data and faceted data
  } //end of method to get filter value

  //method to create query with date field
  public onClickDatesButton(fromDate, toDate, switchBtnCheckedVal) {//MMM-dd-yyyy  

    // console.log("clicked checked value of switch button::::", switchBtnCheckedVal);
    // this.switchCheckboxVal = !this.switchCheckboxVal;
    console.log("this.switchCheckboxVal:::::", this.switchCheckboxVal);
    let frmDT: string = "";
    let toDT: string = "";
    this.fromDT = fromDate;
    this.toDT = toDate;
    if (fromDate) {
      frmDT = this.datePipe.transform(fromDate, 'dd-MMM-yyyy');
    }
    if (toDate) {
      toDT = this.datePipe.transform(toDate, 'dd-MMM-yyyy');
    }
    console.log("fromDate::", this.fromDT + " toDate::", this.toDT);
    let poDTQuery: string = "";
    if (this.switchCheckboxVal) {
      //checking if switchcheckbox is true or false the build the query
      if (fromDate && toDate) {
        //set query according to dates
        poDTQuery =
          this.localStorageService.appSettings.dbFields.poDate 
          + " BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(frmDT, 'dd/MM/yyyy') + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(toDT, 'dd/MM/yyyy') + " 23:59:59\',103)";
        // this.fromDT + " 00:00:01' AND '" + this.toDT + " 23:59:59'";

        this.poDateQuery = poDTQuery;
        console.log("po Date Query:: ", this.poDateQuery);
        // this.invDateFlag = true;//set the flag true to set the invoice dates to the service filter
      }
    } else {
      console.log("else part of switchcheckbox is false..this.switchCheckboxVal:::::", this.switchCheckboxVal);
      this.poDateQuery = "";
      // this.invDateFlag = false;//set the flag false
    }//end of switchcheckbox check       
    this.setPagination();//to get the data and set paginations
    this.poDetViewWSCall();//calling the method to get data
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

  //method to get switch button value 
  public onClickSwitchButton(switchBtnCheckedVal) {
    console.log("clicked checked value of switch button::::", switchBtnCheckedVal);
    this.switchCheckboxVal = !this.switchCheckboxVal;
    console.log("this.switchCheckboxVal:::::", this.switchCheckboxVal);
  }//end of method

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    this.errMsgShowFlag = false;//to hide the error msg div
  }//method to delete error msg

  //method to open invoice details page by clicking on po number
  public onClickPONumber(poNumber: string, poStatus: string) {
    console.log("selected PoNumber::::", poNumber);
    console.log("selected poStatus::::", poStatus);
    let poStatusFilterObj: any = {};
    this.selectedData = [];//removing the array 
    //set the obj element to an object and send it through service
    poStatusFilterObj.filter = this.sortSelection.filter;//this.filterOption;
    poStatusFilterObj.prevFilter = this.sortSelection.prevFilter;
    poStatusFilterObj.facetedArray = this.sortSelection.facetedArray;
    poStatusFilterObj.callingFromFacet = this.sortSelection.callingFromFacet;
    if (this.poDateQuery) {
      let dateQuery = " AND " + this.poDateQuery;
      poStatusFilterObj.poDateQuery = dateQuery;
    } else {
      poStatusFilterObj.poDateQuery = "";
    }
    if (this.filterOption) {
      let filterOptnQuery: string = " AND " + this.filterOption;
      poStatusFilterObj.pofilteroptionquery = filterOptnQuery;
    } else {
      poStatusFilterObj.pofilteroptionquery = "";
    }


    // set from date and to date 28.02.19
    poStatusFilterObj.fromDT = this.fromDT;
    poStatusFilterObj.toDT = this.toDT;

    //added for serverSearchQuery 19.02.19
    if(this.serverSearchQuery){
      let serverSearchQuery: string = " AND " + this.serverSearchQuery;
      poStatusFilterObj.serverSearchQuery = serverSearchQuery;
    }//end of serverSearchQuery 19.02.19
    if(this.serverSearchUrl){
      let serverSearchUrl: string = this.serverSearchUrl;
      poStatusFilterObj.serverSearchUrl = serverSearchUrl;
    }    
    //added for anyValue 19.02.19
    let serverSearchArrTemp: any[] = [];
    if(this.anyValue){
      poStatusFilterObj.anyValue = this.anyValue;
    }else if(this.serverSearchArr.length> 0){
      poStatusFilterObj.anyValue = ""; 
      this.serverSearchArr.forEach(serverSearchEl =>{
        serverSearchArrTemp.push(serverSearchEl);
      });
    }//end of else if 19.02.19
    poStatusFilterObj.serverSearchArr = serverSearchArrTemp;

    poStatusFilterObj.comingFrom = "poview";

    // console.log("poStatusFilterObj::::", poStatusFilterObj);
    this.purchaseOrderInteractionService.poWSFilter = poStatusFilterObj;
    console.log("this.purchaseOrderInteractionService.powsfilter::::", this.purchaseOrderInteractionService.poWSFilter);
    console.log("poStatusWithFilterStr in po view details class::::", poStatus);

    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteInvoiceDetView, poNumber, poStatus]);
  }//end of method


  //to download po file
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

  }//end of method 



  //===== server search =====
  //new add for server search modal
  public serverSearchModal: boolean = false;
  //array to store searched value
  public serverSearchArr: any[] = [];
  public anyValue: string = '';//to show the any value of search modal
  //method to open server search modal
  public onClickFullSearchBtn() {
    this.toggleServerSearchModal();
  }//end of method
  //method to open/close modal
  private toggleServerSearchModal() {
    this.serverSearchModal = this.serverSearchModal ? false : true;
  }//end of method
  //method to cancel modal
  cancelServerSearchModal() {
    this.toggleServerSearchModal();
  }//end of method
  //on search modal submit
  public onClickSearchModalSubmit() {
    this.busySpinner.gridBusy = true;
    this.serverSearchArr = [];//clear the arr
    let searchQuery: string;
    let searchUrl: string;
    this.anyValue = this.serverSearchModalFormGroup.value.anyTypeSearch;
    let poNumberValue = this.serverSearchModalFormGroup.value.poNumber;
    let vendorNameValue = this.serverSearchModalFormGroup.value.vendorName;
    if (this.anyValue) {
      this.anyValue = this.anyValue.trim();
      //for query
      searchQuery = "(" +
        this.purchaseOrderHeaderTableFieldNames.poNumber + " LIKE \'%" + this.anyValue + "%\' OR "
        + this.purchaseOrderHeaderTableFieldNames.vendorName + " LIKE \'%" + this.anyValue + "%\')";

      //for url
      searchUrl = "(" +
        this.purchaseOrderHeaderTableFieldNames.poNumber + " LIKE \'%~" + this.anyValue + "%~\' OR "
        + this.purchaseOrderHeaderTableFieldNames.vendorName + " LIKE \'%~" + this.anyValue + "%~\')";

    } else {
      this.anyValue = '';//clear the any value
      if (poNumberValue) {
        this.serverSearchArr.push({ dbColName: this.purchaseOrderHeaderTableFieldNames.poNumber, value: poNumberValue.trim(), htmlLblName: 'P.O. Number' });
      }
      if (vendorNameValue) {
        this.serverSearchArr.push({ dbColName: this.purchaseOrderHeaderTableFieldNames.vendorName, value: vendorNameValue.trim(), htmlLblName: 'Vendor Name' });
      }
      searchQuery = this.buildQueryFromSearchArr();
      searchUrl = this.buildUrlFromSearchArr();
    }//end of else

    console.log("search query::", searchQuery);
    console.log("search url::", searchUrl);
    this.serverSearchQuery = searchQuery;//set the filter to the param
    this.serverSearchUrl = searchUrl;//to set the filter url
    this.setPagination();//to get the data and set paginations
    // this.getcomplaindetails();//to get the data
    this.toggleServerSearchModal();//to close the modal

  }//end of method

  //for query
  private buildQueryFromSearchArr(): string {
    let searchQuery: string = '';
    let filterQuery: string = '';
    if (this.serverSearchArr.length > 1) {
      this.serverSearchArr.forEach((el, index) => {
        //filterQuery = el.dbColName + " LIKE \'%~" + el.value + "%~\'";
        filterQuery = "(" + el.dbColName + " LIKE \'%" + el.value + "%\')";
        searchQuery = searchQuery ? searchQuery + " AND " + filterQuery : filterQuery;
      });
    } else if (this.serverSearchArr.length == 1) {
      this.serverSearchArr.forEach((el, index) => {
        //filterQuery = el.dbColName + " LIKE \'%~" + el.value + "%~\'";
        filterQuery = "(" + el.dbColName + " LIKE \'%" + el.value + "%\')";
        searchQuery = filterQuery;
      });
    }
    return searchQuery;
  }

  //for url
  private buildUrlFromSearchArr(): string {
    let searchUrl: string = '';
    let filterUrl: string = '';
    if (this.serverSearchArr.length > 1) {
      this.serverSearchArr.forEach((el, index) => {
        filterUrl = "(" + el.dbColName + " LIKE \'%~" + el.value + "%~\')";
        searchUrl = searchUrl ? searchUrl + " AND " + filterUrl : filterUrl;
      });
    } else if (this.serverSearchArr.length == 1) {
      this.serverSearchArr.forEach((el, index) => {
        filterUrl = "(" + el.dbColName + " LIKE \'%~" + el.value + "%~\')";
        searchUrl = filterUrl;
      });
    }
    return searchUrl;
  }

  enableSearchModalBtn() {
    if (this.serverSearchModalFormGroup.value.anyTypeSearch ||
      this.serverSearchModalFormGroup.value.poNumber ||
      this.serverSearchModalFormGroup.value.vendorName) {

      return false;
    } else {
      return true;
    }
  }

  //to reset all search form value
  private resetServerSeachModalForm() {
    this.serverSearchModalFormGroup.controls['anyTypeSearch'].setValue('');
    this.serverSearchModalFormGroup.controls['poNumber'].setValue('');
    this.serverSearchModalFormGroup.controls['vendorName'].setValue('');
  }

  //method to delete by close click
  deleteSearchedValOnClick() {
    let searchQuery: string = '';
    this.serverSearchQuery = '';
    this.serverSearchUrl = '';
    this.finalUrl = '';
    this.anyValue = '';
    this.serverSearchArr = [];
    this.resetServerSeachModalForm();
    console.log("search query::", searchQuery);
    //this.headerparams.filter = searchQuery;//set the filter to the param
    this.busySpinner.gridBusy = true;
    this.setPagination();//to get the data and set paginations
    // this.getcomplaindetails();//to get the data
    //this.loadFacetedNav();
  }
}//end of class
