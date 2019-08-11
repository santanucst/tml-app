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
export class ForgotPasswordService {

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
    return headers;
  }
  //method tpo verify user for forgot password
  userVerificationForForgotPassword(user: any , userType: string) {
    this.configService();
    this.actionUrl = AppUrlsConst.USER_VERIFICATION_FOR_FORGOT_PASSWORD_URL+ "/" +userType;

    return this.http.post(this.actionUrl, user
        // { headers: this.headers }
    )
        .map(this.successCallback)
        .catch(this.errorCallBack);
    }//end of user verification method

    regenerateOtp(user: any){
        this.configService();
    this.actionUrl = AppUrlsConst.REGENERATE_OTP_URL;

    return this.http.post(this.actionUrl, user
        // { headers: this.headers }
    )
        .map(this.successCallback)
        .catch(this.errorCallBack);

    }

private successCallback(res: Response) {
    return res.json();
}

private errorCallBack(error: Response) {
    console.error(error);
    return Observable.throw(error);
}
 


}//end of class
