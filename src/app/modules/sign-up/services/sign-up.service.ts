import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';

@Injectable()
export class SignUpService {
    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http) {

    }

    private configService() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }

    vendorSignUp(user: any, userType: string) {
        this.headers = this.configService();
        this.actionUrl = AppUrlsConst.SIGN_UP_FOR_VENDOR_URL + "/" + userType;
        return this.http.post(this.actionUrl, user, { headers: this.headers })
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
}
