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
export class AddRoleDataService {

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
  
  //GET role details
  getAdminRoleName(roleId: string) {
    this.actionUrl = AppUrlsConst.VIEW_ROLE_URL + "/" + roleId;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
    // return this.http.get(this.actionUrl)
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method

  //submit role
  submitRoleName(role: any) {
    this.actionUrl =  AppUrlsConst.CREATE_ROLE_URL;
    this.headers = this.configService();
    return this.http.post(this.actionUrl, role, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of method

  private successCallback(res: Response) {
    return res.json();
  }//end of successCallBack

  private errorCallBack(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }//end of errorCallBack

  
  //create a method to submit user modify details
  modifyRoleName(role: any) {
    this.actionUrl =  AppUrlsConst.UPDATE_ROLE_URL;
    this.headers = this.configService();
    return this.http.patch(this.actionUrl, role, { headers: this.headers })
      .map(this.successCallbackForModifyUser)
      .catch(this.errorCallBackForModifyUser);
  }//end of userModifyDetailsSubmit method

  private successCallbackForModifyUser(res: Response) {
    return res.json();
  }//end of successCallbackForModifyUser

  private errorCallBackForModifyUser(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }//end of errorCallBackForModifyUser

}//end of class
