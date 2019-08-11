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
export class ManageProfileService {

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

  //method to get security question details
  getSelectValSecurityQuestion() {
    this.actionUrl = AppUrlsConst.ADD_USER_SEQURITY_QUESTION_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method getSelectValSecurityQuestion

  //to get specific user details
  getSelectValUser(){
    this.actionUrl = AppUrlsConst.VIEW_USER_URL + "/" +this.localStorageService.user.userId;
     this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method getSelectValUser

  //method for manage profile user data submit
  manageProfileUserDetails(userDetails: any) {
      this.actionUrl =  AppUrlsConst.MANAGE_PROFILE_USER_SUBMIT_URL;
      this.headers = this.configService();
        return this.http.patch(this.actionUrl, userDetails, { headers: this.headers })
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

}
