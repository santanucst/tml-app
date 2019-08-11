import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { PurchaseOrderHeaderParamModel } from "../models/purchase-order-header-param.model";

@Injectable()
export class PurchaseInvoiceItemViewDataService {

  private actionUrl: string;
  private headers: Headers;
  private userType:string;
  //private plantType: string;
  
  constructor(
    private http: Http,
    private localStorageService: LocalStorageService) {
      console.log("constructor of PurchaseInvoiceItemViewDataService class");
    }
    
    private configService(): Headers {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization', 'bearer ' + this.localStorageService.user.accessToken);
      headers.append('userId', this.localStorageService.user.userId);
      return headers;
    }//end of configService method
    
    private setUserType(){
      // this.plantType = this.localStorageService.user.plantType;
      let usertypeOFLocalStorage: string = this.localStorageService.user.userType;
      if(usertypeOFLocalStorage === "V") {      
        this.userType = "VENDOR";
      }else if(usertypeOFLocalStorage === "E") {
        this.userType = "EMPLOYEE";
      }
    }//end of method

  //get all po details 
 /**
   * 
   * @param purchaseOrderHeasderParam 
   */

 getPODetViewWithFacet(body: any, purchaseOrderHeasderParam: any) {
  this.setUserType();//to set usertype
  this.headers = this.configService();

let param: string = '';
  param+="useFor=PO&userType="+this.userType+"&";
  param += purchaseOrderHeasderParam && purchaseOrderHeasderParam.perPage ? "perPage="+purchaseOrderHeasderParam.perPage+"&" : "perPage=&";
  param += purchaseOrderHeasderParam && purchaseOrderHeasderParam.pageNo ? "pageNo="+purchaseOrderHeasderParam.pageNo+"" : "pageNo=";

  this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL;
    return this.http.post((this.actionUrl+'?'+param), body, { headers: this.headers })
    .map(this.successCallback)
    .catch(this.errorCallBack);
}//end of method

  //get all invoice details 
  getInvoiceDetViewWithFacet(body: any) {
    this.setUserType();//to set usertype
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL+ "?useFor=INVOICE&userType="+this.userType;
      return this.http.post(this.actionUrl, body, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

  //get all invoice-item details 
  getInvoiceItemDetViewWithFacet(body: any) {
    this.setUserType();//to set usertype
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL+ "?useFor=INVOICE_DET&userType="+this.userType;
      return this.http.post(this.actionUrl, body, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

  //get all credit note details 
  getCreditNoteDetViewWithFacet(body: any) {
    this.setUserType();//to set usertype
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL+ "?useFor=CR_NOTE&userType="+this.userType;
      return this.http.post(this.actionUrl, body, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of 
  
  //get all debit note details 
  getDebitNoteDetViewWithFacet(body: any) {
    this.setUserType();//to set usertype
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL+ "?useFor=DR_NOTE&userType="+this.userType;
      return this.http.post(this.actionUrl, body, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

public getHeadercount(filter?:string){
  this.setUserType();
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.PO_INVOICE_ITEM_COUNTER_URL;

  let param: string = '';
  param+="useFor=PO&userType="+this.userType+"&filter="+filter;
  
 
  console.log(param);

  return this.http.get((actionUrl+'?'+param), { headers: headers })
  .map((res: Response) => { return res.json() })
  .catch((error: Response) => { return Observable.throw(error) });
}


  //get all invoice-item details for credit note
  getCreditNoteItemDetViewWithFacet(body: any) {
    this.setUserType();//to set usertype
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL+ "?useFor=CR_NOTE_DET&userType="+this.userType;
      return this.http.post(this.actionUrl, body, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

  //get all invoice-item detailsfor debit note
  getDebitNoteItemDetViewWithFacet(body: any) {
    this.setUserType();//to set usertype
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.PO_INVOICE_ITEM_VIEW_DETAILS_URL+ "?useFor=DR_NOTE_DET&userType="+this.userType;
      return this.http.post(this.actionUrl, body, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

  private successCallback(res: Response) {
    return res.json();
  }

  private errorCallBack(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

}//end of class
