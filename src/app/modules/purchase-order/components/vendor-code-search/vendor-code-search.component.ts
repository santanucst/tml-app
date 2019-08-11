import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastService } from "../../../home/services/toast-service";
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { NgbdModalComponent } from '../../../widget/modal/components/modal-component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdItemNoModalComponent } from '../item-no-modal/item-no-modal.component';
import { InvoiceAddEditDataService } from "../../services/invoice-add-edit-data.service";
import { ItemDetailsService } from "../../services/item-details.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-vendor-code-search-form',
  templateUrl: 'vendor-code-search.component.html',
  styleUrls: ['vendor-code-search.component.css']
})

export class VendorCodeSearchComponent implements OnInit {

  public selectedData: any[] = [];//takin arr for selectedData
  public vendorCode: string;//to store the selected vendor code
  public vendorName: string;
  public searchFormGroup: FormGroup;
  public vendorViewDetails: any = {};//to store vendor view details from ws response
  private invoiceCreditNoRouteParam: string = "";//to get invoice or credit note from route param 
  //busySpinner 
  public busySpinner: any = {
    busy: true
  }
  //for sorting and orderType activity id parameters
  public sortSelection: any = {//sorting the table data 
    sortData: '',
    orderType: ''
  };
  constructor(
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private invoiceAddEditDataService: InvoiceAddEditDataService,
    private itemDetailsService: ItemDetailsService,
    private sessionErrorService: SessionErrorService,
    private router: Router
  ) {
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });

  }//end of constructor

  ngOnInit(): void {
    this.getVendorDetValWS();
    this.getRouteParam();
  }//end of onInit
  //service call method

  //service call method
  private getVendorDetValWS(sortSelection?: any) {
    let plantType =  this.itemDetailsService.plantType;
    this.invoiceAddEditDataService.getVendorDetVal(sortSelection, '',plantType ).
      subscribe(res => {
        console.log(" get vendor details ", res);
        if (res.msgType === "Info") {
          this.vendorViewDetails = res;
        } else if (res.msgType === "Error") {
          this.vendorViewDetails = {};
        }
        this.busySpinner.busy = false;//to stop the busy spinner
        console.log("invoiceCreditNoRouteParam in vendor code search component::::::: ", this.invoiceCreditNoRouteParam);
      },
      err => {
        this.busySpinner.busy = false;//to stop the busy spinner
        console.log("err.msgType========", err);
        console.log("err._body===", err._body);
        this.sessionErrorService.routeToLander(err._body);
      });
  }//end of service call method

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.invoiceCreditNoRouteParam = params.invoiceCreditNoRouteParam ? params.invoiceCreditNoRouteParam : '';
    });
  }//end of method to get route param


  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  onClickTableheader(val) {
    console.log("clicked value : " + val);
    if (this.sortSelection.sortData === val) {
      this.sortSelection.orderType = "DESC";
    } else {
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.getVendorDetValWS(this.sortSelection);
    this.selectedData = [];//removing the array 
  }//end of onclick method


  //creating method to get vendor details by single check
  vendorDetailsByCheckbox(vendorDetail) {
    this.getvendorDetailsByCheckbox(vendorDetail);

  }
  getvendorDetailsByCheckbox(vendorDetail: any) {
    console.log("checked : ", vendorDetail);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length === 0) {
      //push complaintDetail obj to selectedData array
      this.selectedData.push(vendorDetail);
      console.log("vendor View Details selected data : ", this.selectedData);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let selectedData of this.selectedData) {
        if (selectedData.vendorCode === vendorDetail.vendorCode) {
          this.selectedData.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("vendor View Details selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(vendorDetail);
      }//end of if
      console.log("vendor View Details selected data after pushing: ", this.selectedData);
    }//end of else
    //check the param is view then call the view method
  }//end of method of getcomplaintDetailByCheckbox

  //method to select vendor code and route to invoice add/edit page
  public selectVendorCode() {
    for (let vendorDet of this.selectedData) {
      this.vendorCode = vendorDet.vendorCode;
      this.itemDetailsService.vendorCode = this.vendorCode;
      this.itemDetailsService.vendorName = vendorDet.vendorName;
      this.itemDetailsService.vendorGstin = vendorDet.vendorGstin;
      this.itemDetailsService.vendorPanNo = vendorDet.vendorPanCardNo;
      this.itemDetailsService.testVar = "data stored";
    }//end of for
    console.log("complaintRefId for modify : ", this.vendorCode);

    if (this.invoiceCreditNoRouteParam === 'invoice') {
      this.router.navigate([ROUTE_PATHS.RouteInvoiceAddWithVendorCode, this.vendorCode]);
    } else if (this.invoiceCreditNoRouteParam === 'creditNote') {
      this.router.navigate([ROUTE_PATHS.RouteCreditNoteAddWithVendorCode, this.vendorCode]);
    }else if (this.invoiceCreditNoRouteParam === 'debitNote') {
      this.router.navigate([ROUTE_PATHS.RouteDebitNoteAddWithVendorCode, this.vendorCode]);
    }
  }//end of method

  // start method oncancel
  onCancel() {
    this.vendorCode = this.itemDetailsService.vendorCode;
    if (this.vendorCode) {
      if (this.invoiceCreditNoRouteParam === 'invoice') {
        this.router.navigate([ROUTE_PATHS.RouteInvoiceAddWithVendorCode, this.vendorCode]);
      } else if (this.invoiceCreditNoRouteParam === 'creditNote') {
        this.router.navigate([ROUTE_PATHS.RouteCreditNoteAddWithVendorCode, this.vendorCode]);
      } else if (this.invoiceCreditNoRouteParam === 'debitNote') {
        this.router.navigate([ROUTE_PATHS.RouteDebitNoteAddWithVendorCode, this.vendorCode]);
      }
    } else {
      if (this.invoiceCreditNoRouteParam === 'invoice') {
        this.router.navigate([ROUTE_PATHS.RouteInvoiceAdd]);
      } else if (this.invoiceCreditNoRouteParam === 'creditNote') {
        this.router.navigate([ROUTE_PATHS.RouteCreditNoteAdd]);
      } else if (this.invoiceCreditNoRouteParam === 'debitNote') {
        this.router.navigate([ROUTE_PATHS.RouteDebitNoteAdd]);
      }
    }
  }//end of the method

}    