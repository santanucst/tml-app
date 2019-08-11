import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from "../../shared/services/local-storage.service";

@Injectable()
export class InvoiceAddEditDataService {

  private actionUrl: string;
  private headers: Headers;

  constructor(
    private http: Http,
    private localStorageService: LocalStorageService) {

  }

  private configService(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'bearer ' + this.localStorageService.user.accessToken);
    headers.append('userId', this.localStorageService.user.userId);
    return headers;
  }//end of configService method

  private configServiceForFileUpload(): Headers {
    let headers = new Headers();
    headers.append('Authorization', 'bearer ' + this.localStorageService.user.accessToken);
    headers.append('userId', this.localStorageService.user.userId);
    return headers;
  }//end of configService method


  //for file upload (invoice,other doc)
  fileUpload(fileDetails: any, fileDescParam: string) {
    this.headers = this.configServiceForFileUpload();
    this.actionUrl = AppUrlsConst.FILE_UPLOAD_URL+ "/"+ fileDescParam.toUpperCase();
    return this.http.post(this.actionUrl, fileDetails, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

  //file delete method
  fileDelete(fileDetails: any, fileDescParam: string) {
    this.headers = this.configService();
    this.actionUrl = AppUrlsConst.FILE_DELETE_URL;
    return this.http.delete(this.actionUrl,{ headers: this.headers , body: fileDetails})
    // return this.http.delete(this.actionUrl, fileDetails)
        .map(this.successCallback)
        .catch(this.errorCallBack);
    }//end of method

  //to get the desc of other docs
  getSelectedDescVal(){
    let actionUrl = AppUrlsConst.OTHERDOCS_DESC_URL;
    this.headers = this.configService();
    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method

  //to get po numbers of a specific vendor with vendor code
  getPONosVal(code: string, vendorGstInNo: string, plantType: string){
    //let actionUrl = AppUrlsConst.PO_NO_OF_SPECIFIC_VENDOR_URL+ "/" + code;
    let actionUrl = AppUrlsConst.PO_NO_OF_SPECIFIC_VENDOR_URL+ "?vendorCode=" + code+ "&vendorGstin=" + vendorGstInNo + "&plantType=" + plantType;
    this.headers = this.configService();
    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method

   //To get all vendor details
   getVendorDetVal(sortSelection?: any,vendorCode?: string, plantType?: string){
    //  console.log(" vendor code in service class",vendorCode);
     let actionUrl = AppUrlsConst.VENDOR_VIEW_DETAILS_URL;
     if(sortSelection){
       if(sortSelection.sortData && sortSelection.orderType){
        actionUrl = actionUrl + "/" + sortSelection.sortData + "/" + sortSelection.orderType;
       }
     }//end of if
     if(vendorCode){
      actionUrl = actionUrl + "/" + vendorCode;
      //actionUrl = actionUrl + "?vendorCode=" + vendorCode+ "&vendorGstin=" + vendorCode + "&plantType=" + vendorCode;
     }//end of if

     if(plantType){
      actionUrl = actionUrl +"?plantType="+plantType;
     }
     
    this.headers = this.configService();
    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method

  //To get item details of a specific po with vendor code, po number and item code of po under a specific vendor
  getItemDetVal(vendorCode: string, poNo: string,vendorGstInNo: string, invoiceNo?: string,){
    let actionUrl = AppUrlsConst.ITEM_DET_BY_PO_NO_URL+ "/" + vendorCode + "/" + poNo;
    if(invoiceNo){
      actionUrl = actionUrl+ "/" + invoiceNo;
    }
    if(vendorGstInNo){
      actionUrl = actionUrl+ "?vendorGstin=" + vendorGstInNo;
    }
    this.headers = this.configService();
    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method

  //Transaction Add--->> invoice add submit method
  transactionAddSubmit(tranAddDet: any, plantType: string) {
    this.configService();
    this.actionUrl = AppUrlsConst.TRANSACTION_ADD_SUBMIT_URL+ "/" + plantType;
    // + this.localStorageService.appSettings.useForValue1;
      return this.http.post(this.actionUrl, tranAddDet, { headers: this.headers })
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